import { asyncRun } from "../utils/functions";
import { migrate, createDb } from "postgres-migrations";
import { Pool} from "pg";
import { Api } from "../github/web";
import { PullRequest } from "../github/models";

const PASSWORD: string = process.env.PASSWORD==undefined?
  "password":process.env.PASSWORD;
const HOST: string = process.env.HOSTENV==undefined?
  "localhost": process.env.HOSTENV;
const USER: string = process.env.USERDB==undefined?
  "postgres": process.env.USERDB;
const DBNAME: string = process.env.DBNAME==undefined?
  "github": process.env.DBNAME;
const DBPORT: number = process.env.DBPORT==undefined?
  5400: +process.env.DBPORT.trim();

export const pool = new Pool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  port: DBPORT,
  database: DBNAME,
});

export async function migrateDB(): Promise<[boolean, any]>{
  let [_a, err] = await asyncRun(createDb(DBNAME, {
    user: USER,
    port: DBPORT,
    host: HOST,
    password: PASSWORD
  }));
  if(err){
    return [false, err];
  }
  const [_, merr] = await asyncRun(migrate({
    database: DBNAME,
    user: USER,
    password: PASSWORD,
    host: HOST,
    port: DBPORT,
  }, "./src/db/migrate/"));
  if(merr){
    return [false, merr] ;
  }
  return [true, undefined];
};

export async function addNewPRsToDBFresh(username: string, webApi: Api,
  all: boolean): Promise<[number | undefined, any]>{
    let [client, err] = await asyncRun(pool.connect());
    if(err){
      return [undefined, err];
    }
    const prs = await webApi.getPullRequests(username, all);
    let nums = 0;

    //get client
    const insert_query = "INSERT INTO pull_requests (url, repository_url,"
      +"html_url, title, updated_at, created_at, pull_request, body,"
      +"org_icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

    for(let i=0; i< prs.length; i++){
      //add each pr to db
      const data = prs[i].data;
      try{
        await client!.query("BEGIN");
        await client!.query(insert_query, [data.url, data.repository_url,
          data.html_url, data.title, data.updated_at, data.created_at, 
          data.pull_request, data.body, data.org_icon]);
        await client!.query("COMMIT");
        nums+=1;
      }catch(e){
        await client!.query("ROLLBACK");
      }
    }
    client!.release();

    return [nums, undefined];
}

export async function getPrsFromDB():
  Promise<[Array<PullRequest> | undefined, any]>{
  let [client, err] = await asyncRun(pool.connect());
  if(err){
    return [undefined, err];
  }

  const select_query = "SELECT * FROM pull_requests";
  let [result, e] = await asyncRun(client!.query(select_query));
  if(e){
    client!.release();
    return [undefined, e];
  }

  let prs = new Array<PullRequest>();
  result!.rows.forEach(row =>{
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
        merged_at: row.pull_request
      }
    });
    prs.push(pr);
  });
  return [prs, undefined];
}

export async function setTimeDB(time: string): Promise<[boolean, any]>{
  let [client, err] = await asyncRun(pool.connect());
  if(err!=undefined){
    return [false, err];
  }
  let select_query = "SELECT * from last_update";
  const [rows, er]  = await asyncRun(client!.query(select_query));
  if(er!=undefined){
    return [false, er];
  }

  //insert into db if empty
  let insert_query = "INSERT INTO last_update (time) VALUES ($1)";

  if(rows!.rows.length>0){
    //otherwise update time
    insert_query = "UPDATE last_update SET time = ($1) WHERE id="+rows!.rows[0].id;
  }
  try {
    await client!.query("BEGIN");
	await client!.query(insert_query, [time]);
    await client!.query("COMMIT");
	return [true, undefined];
  }catch(e){
    client!.query("ROLLBACK");
    return [false, e];
  }finally{
    client!.release();
  }
}

export async function getLastTimeDB(): Promise<[Date | undefined, any]>{
	const [client, er] = await asyncRun(pool.connect());
	if(er!=undefined){
		return [undefined, er];
	}

	const select_query = "SELECT * from last_update";
	let [rows, err] = await asyncRun(client!.query(select_query));
	if(err!=undefined){
		return [undefined, undefined];
	}
	if(rows!.rowCount!=1){
		const now = new Date();
		//set time to last year
		return [new Date(now.getFullYear()-1, now.getMonth(), now.getDay()), undefined];
	}else{
		return [new Date(rows!.rows[0].time), err];
	}
}
