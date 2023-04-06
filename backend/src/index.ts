import express from "express";
import { getPrsFromDB, migrateDB } from "./db/db";
import { Api } from "./github/web";
import { loopAndFillDB, sleep } from "./utils/functions";

/// True once db is loaded with PRs atleast once
let has_loaded_db_once = false;
const USER_NAME = "borwe";
const api = new Api();
const app = express();
const PORT: number = process.env.PORT == undefined ? 4000 : +process.env.PORT.trim();

async function fillDB() {
	let [mig, migErr] = await migrateDB();
	while(migErr!= undefined || mig == false){
		console.error("DB init migration init  failed retrying", migErr);
		[mig, migErr] = await migrateDB();
	}
	//check if db filled, already atleast once
	let [prs, er] = await getPrsFromDB();
	if (er == undefined) {
		if (prs!.length > 0) {
			console.log("Not fresh start");
			has_loaded_db_once = true;
		}
	}
	//keep on filling it in 24 hour intervals
	while (true) {
		let [_date, err] = await loopAndFillDB(USER_NAME, api, 24);
		if (err != undefined) {
			console.error(err);
			throw err;
		}else if(has_loaded_db_once==false){
			let [prs, er] = await getPrsFromDB();
			if (er == undefined) {
				if (prs!.length > 0) {
					console.log("Fresh DB FILL");
					has_loaded_db_once = true;
				}
			}
		}
	}
}


async function waitForFirstLoad(){
	while (has_loaded_db_once == false) {
		console.log("Checking if Db filling completed, first");
		await sleep(1000);
	}
}

async function startup(){
	await api.init();
	console.log("Filling DB");
	fillDB();
	await waitForFirstLoad();
}

app.get("/opensource", async function(_, res){
	await waitForFirstLoad();
	let [prs, er] = await getPrsFromDB();
	if(er!=undefined){
		res.contentType("application/json");
		res.status(504);
		res.json(er);
	}else{
		const data_prs = prs!.filter(pr=>{
			return !pr.data.url.toLowerCase().includes(USER_NAME)
		}).filter(pr=> pr.data.pull_request.merged_at.merged_at != undefined)
			.map(pr=> pr.data);
		res.contentType("application/json");
		res.json(data_prs);
	}

})

app.listen(PORT, async () => {
	await startup();
	console.log("Server listening on port",PORT);
});
