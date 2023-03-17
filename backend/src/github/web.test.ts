import { describe, it, expect, beforeAll} from "@jest/globals";
import { PullRequest } from "./models";
import { Api } from "./web";

describe("Pull Request info", ()=>{
  let api = new Api();

  beforeAll(async ()=>{
    await api.init();
  });

  it("Test pagenumbers",()=>{
    //search items is 100.
    const total_items = 250;
    let current_page = 1;
    let next = api.getNextPageNumberInSearch(current_page, total_items);
    expect(next).toEqual(2);
    next = api.getNextPageNumberInSearch(next, total_items);
    expect(next).toEqual(3);
    next = api.getNextPageNumberInSearch(next, total_items);
    expect(next).toEqual(3);
  });

  it("Getting first 100 prs", async ()=>{
    let pr: Array<PullRequest> = await api.getPullRequests("borwe", true);
    expect(pr.length).toBeGreaterThan(0);
    expect(pr.length).toEqual(60);
  }, 2000000);
});
