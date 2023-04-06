import { addNewPRsToDBFresh, getLastTimeDB, getPrsFromDB, setTimeDB } from "../db/db";
import { Api } from "../github/web";

export async function asyncRun<T>(promise: Promise<T>)
	: Promise<[T | undefined, any | undefined]> {
	try {
		const res = await promise;
		return [res, undefined]
	} catch (e) {
		return [undefined, e]
	}
}

export const sleep = async (waitTime: number) =>
	await new Promise(resolve => setTimeout(resolve, waitTime));


/**
   Get last time database was filled
   if Time passed in fro @hours_to_loop less than current time, then try fill
   the database again, else wait till that time period has passed
   then try again.
   Once finished update the DB time, and then return the current time
   */
export async function loopAndFillDB(user: string, api: Api,
	hours_to_loop: number): Promise<[Date | undefined, any]> {

	//get last time db was updated
	const [da, er] = await getLastTimeDB();
	if (er != undefined) {
		console.error("ERROR_GET_TIME_DB:", er);
		return [undefined, er];
	}
	const [prs, prers] = await getPrsFromDB();
	if(prers!=undefined){
		console.error("ERROR_GET_PRS_DB:", prers);
		return [undefined, prers];
	}
	//get the current time
	let now = new Date();
	//get difference between db time and now
	const dif = (now.getMilliseconds()/(1000*60*60)) - (da!.getMilliseconds()/(1000*60*60));
	if (dif < hours_to_loop && prs!.length!==0) {
		//do a wait for the dif in time
		const wait_time = (hours_to_loop - dif) * 60*60 ;
		await sleep(wait_time * 1000);
	}

	console.log("LOLOL");
	//get and add the prs to db
	const [_added, adderr] = await addNewPRsToDBFresh(user, api, true);
	if (adderr != undefined) {
		console.error("ERROR_ADD_PR_DB:", er);
		return [undefined, adderr];
	}

	const finishd = new Date();
	const [_updt, dter] = await setTimeDB(finishd.toString());
	if (dter != undefined) {
		console.error("ERROR_ADD_DATE_DB:", er);
		return [undefined, dter];
	}

	return [finishd, undefined];
}
