import { describe, it, expect} from "@jest/globals";
import {migrateDB} from "./db";

describe("test creating/connecting to db", ()=>{
  it("Test migration if success", async ()=>{
    const [_, err] = await migrateDB();
    expect(err).toBeUndefined();
  });
});
