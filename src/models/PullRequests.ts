export class PullRequest{
  url!: string;
  repository_url!: string;
  comments_url!: string;
  html_url!: string;
  title!: string;
  state!: string;
  body!: string;
  created_at!: string;
  repo_pic!: string;
}

export class PullRequestPage{
  total_count!: number;
  incomplete_results!: boolean;
  items!: Array<PullRequest>;
}

export class OwnerInfo{
  avatar_url!: string;
}

export class RepoURL{
  owner!: OwnerInfo;
}

export class NetworkError{
  message?: string;
  constructor(message: string){
    this.message=message;
  }
}
