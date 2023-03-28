import { describe, it, expect, beforeAll} from "@jest/globals";
import { migrateDB } from "../db/db";
import { Api } from "../github/web";
import { loopAndFillDB } from "./functions";


beforeAll(async ()=>{
    const [_, err] = await migrateDB();
}, 200000);

describe("Testing looping and filling DB", ()=>{
	const api = new Api();
	beforeAll(async ()=>{
		await api.init();
	}, 200000);
	it("Loop And fill in every 5 seconds",async ()=>{
		const seconds_2_in_hours = (1/(60*60))*2;
		//1800 2seconds should equal to 1 hr, which is 3600 seconds
		expect((seconds_2_in_hours*1800)).toEqual(1);
		const [d1, er] = await loopAndFillDB("borwe", api, seconds_2_in_hours);
		expect(er).toBeUndefined();
		const [d2, er2] = await loopAndFillDB("borwe", api, seconds_2_in_hours);
		expect(er2).toBeUndefined();
		const dif = d2!.getSeconds() - d1!.getSeconds();
		expect(dif).toBeGreaterThanOrEqual(2);
	}, 200000);
})
