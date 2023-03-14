import { describe, expect, it } from "@jest/globals";
import { generatePullRequestLink } from "./consts";

describe("Check consts", ()=>{
  it("Check username function", ()=>{
    const user_input = generatePullRequestLink("borwe");
    const expected_answ = "https://api.github.com/search/issues?q=author:borwe+is:pr+is:closed&per_page=100";
    expect(user_input).toEqual(expected_answ);
  })
})
