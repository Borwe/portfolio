import { addNewPRsToDBFresh, getLastTimeDB, getPrsFromDB, setTimeDB } from "../db/db";
import { Api } from "../github/web";

export async function asyncRun<T>(promise: Promise<T>)
  : Promise<[T|undefined, any|undefined]>{
  try{
    const res = await promise;
    return [res, undefined]
  }catch(e){
    return [undefined, e]
  }
}

export const sleep = async (waitTime: number)=> 
  await new Promise(resolve => setTimeout(resolve, waitTime));


/**
   Get last time database was filled
   if Time passed in fro @hours_to_loop less than current time, then try fill
   the database again, else wait till that time period has passed
   then try again.
   Once finished update the DB time, and then return the current time
   */
export async function loopAndFillDB(user: string, api: Api,
	hours_to_loop: number) : Promise<[Date | undefined, any]> {
	//get last time db was updated
	const [da, er] = await getLastTimeDB();
	if(er!=undefined ){
		console.error("ERROR_GET_TIME_DB:", er);
		return [undefined, er];
	}
	//get the current time
	let now = new Date();
	//get difference between db time and now
	const dif = now.getSeconds() - da!.getSeconds();
	if(dif/(60*60) < hours_to_loop){
		//do a wait for the dif in time
		await sleep(dif*1000);
	}
	const [prs, epr] = await getPrsFromDB();
	if(epr!=undefined){
		console.error("ERROR_GET_PR_DB:", er);
		return [undefined, epr];
	}

	const get_all_prs = prs!.length>0? false: true;
	//get and add the prs to db
	const [_added, adderr] = await addNewPRsToDBFresh(user, api, get_all_prs);
	if(adderr!=undefined){
		console.error("ERROR_ADD_PR_DB:", er);
		return [undefined, adderr];
	}

	const finishd = new Date();
	const [_updt, dter] = await setTimeDB(finishd.toString());
	if(dter!=undefined){
		console.error("ERROR_ADD_DATE_DB:", er);
		return [undefined, dter];
	}

	return [finishd, undefined];
}
