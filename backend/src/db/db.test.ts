import { describe, it, expect, afterAll, beforeAll} from "@jest/globals";
import { Api } from "../github/web";
import {addNewPRsToDBFresh, migrateDB} from "./db";

describe("test creating/connecting to db", ()=>{
  const webApi = new Api();


  it("Test migration if success", async ()=>{
    const [_, err] = await migrateDB();
    expect(err).toBeUndefined();
  });

  it("Test inserting to pull_requests", async ()=>{
    const [r, err] = await addNewPRsToDBFresh("borwe", webApi, true);
    expect(err).toBeUndefined();
    expect(r).toBeGreaterThanOrEqual(60); //at this time I have 60 prs

    const [r2, err2] = await addNewPRsToDBFresh("borwe", webApi, false);
    //should not have error, but also should have an r2 with value 0, since
    //all PRs have already been added from previous statements above
    expect(err2).toBeUndefined();
    expect(r2).toEqual(0); //at this time I have 60 prs
  }, 2000000);

});
