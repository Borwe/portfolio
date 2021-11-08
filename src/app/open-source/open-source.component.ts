import { Component, OnInit } from '@angular/core';
import { count } from 'rxjs/operators';
import { PullRequest } from 'src/models/PullRequests';
import { GithubServiceService } from 'src/services/github-service.service';

@Component({
  selector: 'app-open-source',
  templateUrl: './open-source.component.html',
  styleUrls: ['./open-source.component.css']
})
export class OpenSourceComponent implements OnInit {
  //for holding pull requests
  public prS: Array<PullRequest> = new Array<PullRequest>();

  constructor(private githubService: GithubServiceService) { }

  ngOnInit(): void {
    this.githubService.getOpenSourcePRs().subscribe((val=>{
      this.prS.push(val)
    }));
  }

}
