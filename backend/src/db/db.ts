import { asyncRun } from "../utils/functions";
import { migrate, createDb } from "postgres-migrations";
import { Pool} from "node-postgres";

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
