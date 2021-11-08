import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, filter, delay } from 'rxjs/operators';
import { NetworkError } from 'src/models/PullRequests';
import { RateLimit, SearchLimit } from 'src/models/RateLimit';

class CheckSearchLimit{
  private count: number= 0;
  constructor(private gitHubService: GithubServiceService){}

  getSearchLimitObject(): Observable<SearchLimit>{
    return this.gitHubService.getRateJson().pipe(mergeMap(val=>{
      //if success, then just continue
      if(val.status==200){
        return new Observable(sub=>{
          sub.next(val.body);
          sub.complete();
        })
      }
      //we get here if we failed, retry for 5 times, then just quit returning
      //error object
      if(this.count<5){
        return this.getSearchLimitObject();
      }else{
        return new Observable(sub=>{
          sub.next(new NetworkError("failed getting rate"))
          sub.complete()
        })
      }
    })).pipe(filter(val=>{
      if(val instanceof NetworkError){
        return false;
      }
      return true;
    })).pipe(map(val=>{
      let rateLimit: RateLimit = val as RateLimit;
      let searchLimit: SearchLimit= rateLimit.resources.search;
      return searchLimit;
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class GithubServiceService {
  private prLink: string= "https://api.github.com/search/issues?q=author%3Aborwe+type%3Apr";
  private rateLimitUrl: string="https://api.github.com/rate_limit";

  constructor(private client: HttpClient) { }

  // Used for getting rate json
  getRateJson():Observable<HttpResponse<Object>> {
    return this.client.get(this.rateLimitUrl,{
      observe: "response",
      responseType: "json"
    });
  }

  //method for checking if limit has reached for searches, if so
  //wait until the given timeout before proceeding, return a SeachLimit Observable
  checkSearchLimitAndWaitTillReady():Observable<SearchLimit> {
    let checkLimit: CheckSearchLimit = new CheckSearchLimit(this);
    return checkLimit.getSearchLimitObject().pipe(mergeMap(val=>{
      let wait_period:number = (new Date().valueOf()/1000) -(val.reset || Number.MAX_VALUE);
      let obsv:Observable<SearchLimit> = new Observable(sub=>{
        sub.next(val);
        sub.complete()
      })
      if(wait_period>0){
        obsv = obsv.pipe(delay(wait_period));
      }
      return obsv;
    }))
  }

  getOpenSourcePRs(){
    this.checkSearchLimitAndWaitTillReady().subscribe();
  }
}
