export function generatePullRequestLink(user: string){
  return `https://api.github.com/search/issues?q=author:${user}+is:pr+is:closed&per_page=100`
}
