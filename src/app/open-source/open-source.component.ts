import { Component, OnInit } from '@angular/core';
import { GithubServiceService } from 'src/services/github-service.service';

@Component({
  selector: 'app-open-source',
  templateUrl: './open-source.component.html',
  styleUrls: ['./open-source.component.css']
})
export class OpenSourceComponent implements OnInit {

  constructor(private githubService: GithubServiceService) { }

  ngOnInit(): void {
    this.githubService.getOpenSourcePRs().subscribe((val=>{
      console.log("PullRequest: ",val)
    }))
  }

}
