import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, filter, delay } from 'rxjs/operators';
import { NetworkError, PullRequest, PullRequestPage, RepoURL } from 'src/models/PullRequests';
import { CoreLimit, RateLimit, SearchLimit } from 'src/models/RateLimit';

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
      let wait_period:Date = new Date(val.reset*1000);
      let obsv:Observable<SearchLimit> = new Observable(sub=>{
        sub.next(val);
        sub.complete()
      })
      if(wait_period.getTime()>new Date().getTime()){
        console.log("WAIT_TILL_SEARCH: ",wait_period)
        obsv = obsv.pipe(delay(wait_period));
      }
      return obsv;
    }))
  }

  checkCoreLimitAndWaitTillReday():Observable<CoreLimit>{
    return this.getRateJson().pipe(map(val=>{
      let response:HttpResponse<Object> = val 
      while(val.status!=200){
        //repeat till we get a good value
        let url:string = response.url || "";
        this.client.get(url,{
          observe: "response",
          responseType: "json"
        }).toPromise().then(v=>{response=v});
      }
      //get corelimit
      let rateLimit:RateLimit = response.body as RateLimit;
      let corelimit:CoreLimit = rateLimit.resources.core;
      return corelimit;
    })).pipe(mergeMap(val=>{
      let wait_period:Date =new Date(val.reset*1000);
      let obsv: Observable<CoreLimit> = new Observable(sub=>{
        sub.next(val)
        sub.complete()
      });

      if(wait_period.getTime()>new Date().getTime()){
        console.log("WAIT_TILL_CORE: ",wait_period)
        obsv = obsv.pipe(delay(wait_period));
      }
      return obsv;
    }))
  }

  private getPRFromResponse(response: HttpResponse<Object>): Observable<PullRequest> {

    let val_return: Observable<PullRequest> = new Observable(sub=>{
      
      while(response.status != 200){
        //keep making the request till it returns a 200
        let url:string = response.url || "";
        this.client.get(url,{
          observe: "response",
          responseType: "json"
        }).toPromise().then(val=>{response=val});
      }
      sub.next(response.body)
      sub.complete();
    }).pipe(mergeMap(val=>{
      //now transform it to a PullRequest from object
      let arrayOfPRs: Array<PullRequest> = (val as PullRequestPage).items;
      return new Observable<PullRequest>(sub=>{
        arrayOfPRs.forEach(p=>{
          sub.next(p)
        })
        sub.complete()
      })
    }));

    return val_return;
  }

  private getFullPRURls(pageOneInfo: HttpResponse<Object>): Observable<PullRequest>{
    let headers: HttpHeaders = pageOneInfo.headers;
    let links:string = headers.get("link") || "";

    // check if link contains 'rel="last"'
    // for the last page.
    // from that we can start from pageOneInfo to the last page url
    let responses: Observable<PullRequest> = new Observable(sub=>{
      if(links.endsWith('rel="last"')){
        //get the last page
        let link: Array<string>= links.match("(?<=<)(.*?)(?=>)") || [];
        let page_info: Array<string> = link[1].match("(?<=page=)(.*)") || [];
        let last_page = parseInt(page_info[0]) || 1;
        for(let x=1;x<=last_page;++x){
          sub.next(x)
        }
      }
      sub.complete();
    }).pipe(mergeMap(val=>{
      let page_number:number = val as number;
      return this.checkSearchLimitAndWaitTillReady().pipe(mergeMap(v=>{
        let prURL = this.prLink + "&page=" + page_number.toLocaleString()
        return this.client.get(prURL,{
          observe: "response",
          responseType: "json"
        });
      }))
    })).pipe(mergeMap(val=>{
      return this.getPRFromResponse(val);
    }));

    return responses;
  }

  getOpenSourcePRs(url?:string): Observable<PullRequest>{
    return this.checkSearchLimitAndWaitTillReady().pipe(mergeMap(val=>{
      return this.client.get(this.prLink,{
        observe: "response",
        responseType: "json"
      });
    })).pipe(mergeMap(val=>{
      let response: HttpResponse<Object> = val;
      while(response.status!=200){
        //meaning request not successful, then repeat
        this.client.get(response.url || "",{
          observe: "response",
          responseType: "json"
        }).toPromise().then(val=>{response=val});
      }

      //we reach here if request was a success
      return this.getFullPRURls(response);
    })).pipe(mergeMap(val=>{
      let repu_url = val.repository_url;
      return this.checkCoreLimitAndWaitTillReday().pipe(mergeMap(vl=>{
        return this.client.get(repu_url,{
          observe: "response",
          responseType: "json"
        }).pipe(map(resp=>{
          let response = resp;
          while(response.status!=200){
            //meaning request not successful, then repeat
            this.checkCoreLimitAndWaitTillReday().pipe(mergeMap(v=>{
              return this.client.get(response.url || "",{
                observe: "response",
                responseType: "json"
              });
            })).toPromise().then(v=>{response=v});
          }
          let avator_url:string = (response.body as RepoURL).owner.avatar_url;
          val.repo_pic=avator_url;
          return val
        }))

      }))    
    }))
  }  
}
