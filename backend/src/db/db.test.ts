import { describe, it, expect} from "@jest/globals";
import { Api } from "../github/web";
import {addNewPRsToDBFresh, migrateDB} from "./db";

describe("test creating/connecting to db", ()=>{
  const webApi = new Api();

  it("Test migration if success", async ()=>{
    const [_, err] = await migrateDB();
    expect(err).toBeUndefined();
  });

  it("Test inserting to pull_requests", async ()=>{
    const [r, err] = await addNewPRsToDBFresh("borwe", webApi);
    expect(err).toBeUndefined();
    expect(r).toBeGreaterThanOrEqual(60); //at this time I have 60 prs
  }, 2000000);
});
