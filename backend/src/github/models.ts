export type PullRequestMergedAt = {
  merged_at: string | null;
}

export type PullRequestData = {
  url: string;
  repository_url: string;
  html_url: string;
  title: string;
  updated_at: string;
  created_at: string;
  pull_request: PullRequestMergedAt;
  body: string;
  org_icon: string | undefined;
}

export class PullRequest {

  data: PullRequestData;

  constructor(data: PullRequestData){
    this.data = data;
  }

  getOrgIcon(): string{
    if(this.data.org_icon!=undefined){
      return this.data.org_icon!;
    }
    throw new Error("org_icon field empty");
  }

  setOrgIcon(url: string){
    this.data.org_icon = url;
  }
}
