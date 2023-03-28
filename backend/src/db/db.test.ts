import { describe, it, expect} from "@jest/globals";
import { Api } from "../github/web";
import {addNewPRsToDBFresh, migrateDB, getPrsFromDB, setTimeDB, getLastTimeDB} from "./db";

const webApi = new Api();

beforeAll(async ()=>{
    const [_, _err] = await migrateDB();
}, 200000);

describe("Tests adding to DB",()=>{
  it("inserting to pull_requests", async ()=>{
    const [_r, err] = await addNewPRsToDBFresh("borwe", webApi, true);
    expect(err).toBeUndefined();

    const [r2, err2] = await addNewPRsToDBFresh("borwe", webApi, false);
    //should not have error, but also should have an r2 with value 0, since
    //all PRs have already been added from previous statements above
    expect(err2).toBeUndefined();
    expect(r2).toEqual(0); //at this time I have 60 prs
  }, 2000000);
});

describe("Tests getting from db", ()=>{
  it("get prs from db", async ()=>{
    const [r, err ] = await getPrsFromDB();
    expect(err).toBeUndefined();
    expect(r!.length).toBeGreaterThanOrEqual(60);
  }, 2000000);
});


describe("Testing getting Time When empty",()=>{
	it("getTime when unset should have error", async ()=>{
		const [re, _er] = await getLastTimeDB();
		expect(re!=undefined).toBeTruthy();
	});
});

describe("Test updating time", ()=>{
  it("setTime", async ()=>{
    const time = new Date().toString();
    let [s, e] = await setTimeDB(time);
    expect(e).toBeUndefined();
    expect(s).toBeTruthy();

    [s, e] = await setTimeDB(time);
    expect(e).toBeUndefined();
    expect(s).toBeTruthy();

    [s, e] = await setTimeDB(time);
    expect(e).toBeUndefined();
    expect(s).toBeTruthy();
  })
});
