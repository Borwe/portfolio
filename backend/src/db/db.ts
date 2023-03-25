import { asyncRun } from "../utils/functions";
import { migrate, createDb } from "postgres-migrations";
import { Pool} from "pg";
import { Api } from "../github/web";

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
  max: 3
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

export async function addNewPRsToDBFresh(username: string, webApi: Api): 
  Promise<[number | undefined, any]>{
    let [client, err] = await asyncRun(pool.connect());
    if(err){
      return [undefined, err];
    }
    const prs = await webApi.getPullRequests("borwe", true);
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
        console.log("ERROR:",e);
        return [undefined, e];
      }
    }
    client!.release();

    return [nums, undefined];
}
