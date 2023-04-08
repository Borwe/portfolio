import { asyncRun } from "../utils/functions";
import { migrate, createDb } from "postgres-migrations";
import { Pool } from "pg";
import { Api } from "../github/web";
import { PullRequest } from "../github/models";

const PASSWORD: string = process.env.POSTGRES_PASSWORD == undefined ?
	"password" : process.env.POSTGRES_PASSWORD;
const DBHOST: string = process.env.DBHOST == undefined ?
	"localhost" : process.env.DBHOST;
const DBUSER: string = process.env.DBUSER == undefined ?
	"postgres" : process.env.DBUSER;
const DBNAME: string = process.env.DBNAME == undefined ?
	"github" : process.env.DBNAME;
const DBPORT: number = process.env.DBPORT == undefined ?
	5432 : +process.env.DBPORT.trim();

const pool = new Pool({
	host: DBHOST,
	user: DBUSER,
	password: PASSWORD,
	port: DBPORT,
	database: DBNAME,
});

export async function migrateDB(): Promise<[boolean, any]> {
	let [_a, err] = await asyncRun(createDb(DBNAME, {
		user: DBUSER,
		port: DBPORT,
		host: DBHOST,
		password: PASSWORD
	}));
	if (err) {
		return [false, err];
	}
	const [_, merr] = await asyncRun(migrate({
		database: DBNAME,
		user: DBUSER,
		password: PASSWORD,
		host: DBHOST,
		port: DBPORT,
	}, "./src/db/migrate/"));
	if (merr) {
		return [false, merr];
	}
	return [true, undefined];
};

export async function addNewPRsToDBFresh(username: string, webApi: Api,
	all: boolean): Promise<[number | undefined, any]> {
	let [client, err] = await asyncRun(pool.connect());
	if (err) {
		return [undefined, err];
	}
	const prs = await webApi.getPullRequests(username, all);
	let nums = 0;

	//get client
	const insert_query = "INSERT INTO pull_requests (url, repository_url,"
		+ "html_url, title, updated_at, created_at, pull_request, body,"
		+ "org_icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

	for (let i = 0; i < prs.length; i++) {
		//add each pr to db
		const data = prs[i].data;
		try {
			await client!.query("BEGIN");
			await client!.query(insert_query, [data.url, data.repository_url,
			data.html_url, data.title, data.updated_at, data.created_at,
			JSON.stringify(data.pull_request), data.body, data.org_icon]);
			await client!.query("COMMIT");
			nums += 1;
		} catch (e) {
			await client!.query("ROLLBACK");
		}
	}
	client!.release();

	return [nums, undefined];
}

export async function getPrsFromDB():
	Promise<[Array<PullRequest> | undefined, any]> {

	const select_query = "SELECT * FROM pull_requests";
	let [result, e] = await asyncRun(pool.query(select_query));
	if (e) {
		return [undefined, e];
	}

	let prs = new Array<PullRequest>();
	result!.rows.forEach(row => {
		let pr = new PullRequest({
			url: row.url,
			repository_url: row.repository_url,
			html_url: row.html_url,
			title: row.title,
			updated_at: row.updated_at,
			created_at: row.created_at,
			body: row.body,
			org_icon: row.org_icon,
			pull_request: {
				merged_at: JSON.parse(row.pull_request)
			}
		});
		prs.push(pr);
	});
	return [prs, undefined];
}

export async function setTimeDB(time: string): Promise<[boolean, any]> {
	let [client, err] = await asyncRun(pool.connect());
	if (err != undefined) {
		return [false, err];
	}

	let select_query = "SELECT * from last_update";
	const [rows, er] = await asyncRun(pool.query(select_query));
	if (er != undefined) {
		return [false, er];
	}

	//insert into db if empty
	let insert_query = "INSERT INTO last_update (time) VALUES ($1)";

	if (rows!.rows.length > 0) {
		//otherwise update time
		insert_query = "UPDATE last_update SET time = ($1) WHERE id=" + rows!.rows[0].id;
	}
	try {
		await client!.query("BEGIN");
		await client!.query(insert_query, [time]);
		await client!.query("COMMIT");
		return [true, undefined];
	} catch (e) {
		client!.query("ROLLBACK");
		return [false, e];
	} finally {
		client!.release();
	}
}

export async function getLastTimeDB(): Promise<[Date | undefined, any]> {
	const select_query = "SELECT * from last_update";
	let [rows, err] = await asyncRun(pool.query(select_query));
	if (err != undefined) {
		const now = new Date();
		//set time to last year
		return [new Date(now.getFullYear() , now.getMonth(), now.getDay()-1), undefined];
	}
	if (rows!.rowCount != 1) {
		const now = new Date();
		//set time to last year
		return [new Date(now.getFullYear(), now.getMonth(), now.getDay()-1), undefined];
	} else {
		return [new Date(rows!.rows[0].time), err];
	}
}
