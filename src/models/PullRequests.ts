
export class PullRequest{
  url?: string;
  repository_url?: string;
  comments_url?: string;
  html_url?: string;
  title?: string;
  state?: string;
  body?: string;
}

export class NetworkError{
  message?: string;
  constructor(message: string){
    this.message=message;
  }
}
