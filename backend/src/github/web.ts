import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
import { asyncRun, sleep } from "../utils/functions";
import { generatePullRequestLink, generatePullRequestLinkWithPage } from "./consts";
import { PullRequest } from "./models";

const RATE_LIMIT_URL = "https://api.github.com/rate_limit";

type ResourceLimitsInfo = {
  limit: number,
  remaining: number,
  reset: number
}

type ResourceLimits = {
  resources: {
    core: ResourceLimitsInfo,
    search: ResourceLimitsInfo,
  }
}

type PRsListResponse = {
  total_count: number;
  items: Array<PullRequest>
}

function nowInMicroSeconds(): number{
  let now = ((new Date()).valueOf()/1000).toString();
  return parseInt(now.slice(now.search("\.")));
}

export class Api {
  axiosInstance:  AxiosInstance;
  /* If false, means user didn't call init method, hence fail 
   * using any method in this objects instance 
   */
  initialized: boolean;
  searchInfo:  ResourceLimitsInfo;

  constructor(){
    this.initialized=false;
    dotenv.config();
    const personal_key = process.env.GITHUB_PERSONAL_KEY!;
    this.axiosInstance = axios.create({
      headers: {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Authorization": `Bearer ${personal_key}`
      }
    });
    this.searchInfo = {} as ResourceLimitsInfo;
  }

  async init(){
    const [d, err] = await asyncRun(
      this.axiosInstance.get<ResourceLimits>(RATE_LIMIT_URL));
    if(err){
      throw err;
    }
    this.searchInfo.limit = d!.data.resources.search.limit;
    this.searchInfo.reset = d!.data.resources.search.reset;
    this.searchInfo.remaining = d!.data.resources.search.remaining;

    this.initialized=true;
  }

  private async doHubSearch<T>(url: string){
    await this.init();
    if(this.searchInfo.limit<=0){
      let waitTime = Math.abs(this.searchInfo.reset- nowInMicroSeconds());
      await sleep(waitTime);
    }
    return await asyncRun(this.axiosInstance.get<T>(url));
  }

  /**
   * @user here is the github user account name.
   * @all means, to get all pull requests on all pages
   * Throws if didn't call init() atleast once on object'
  */
  async getPullRequests(user: string, all: boolean): Promise<Array<PullRequest>>{
    if(this.initialized==false){
      throw new Error("Didn't call initialize on this object atleast once");
    }
    const url = generatePullRequestLink(user);
    const [d, err] = await this.doHubSearch<PRsListResponse>(url);

    let pullRequests = new Array<PullRequest>();
    d!.data.items.forEach(p=>pullRequests.push(p));

    if(all){
      //get all pages
      const total_items = d!.data.total_count;
      let current_page = 1;
      let next_page = current_page;
      //hold all the REST requests here
      let promises = new Array<Promise<[typeof d, typeof err]>>();
      do{
        next_page = this.getNextPageNumberInSearch(
          current_page,total_items);
        if(next_page !=current_page){
          current_page = next_page;
          const url = generatePullRequestLinkWithPage(user, next_page);
          promises.push(this.doHubSearch<PRsListResponse>(url));
        }
      }while(next_page!=current_page);
      
      (await Promise.all(promises)).filter(x=>x[1]==undefined).map(x=>x[0])
        .forEach(x=>x?.data.items.forEach(p=>pullRequests.push(p)));
    }
    
    return pullRequests;
  }

  getNextPageNumberInSearch(current_page: number,
     total_items: number):number{
    const items_parsed = current_page*100;
    if(total_items>items_parsed){
      return current_page+1;
    }
    return current_page;
  }
}
