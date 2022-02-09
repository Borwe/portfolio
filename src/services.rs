use reqwest::{Client, Response, Request, Method, Url,
  Body, header::HeaderValue};
use serde_json::Value;
use crate::constants;
use crate::models::{Rate, RateResource, PullRequest};
use std::collections::HashMap;
use std::time::{SystemTime, Duration};

pub async fn check_rate_and_sleep(rate_type: RateResource)-> reqwest::Result<()>{
  let client = Client::new();
  let req = make_request(Method::GET,
     Url::parse(constants::RATE_URL).unwrap(), None);
  let response: Response = client.execute(req).await?;
  let json_response = serde_json::Value::from(response.text().await?);
  let rates: HashMap<RateResource, Rate> = Rate::from(json_response);
  let rate: &Rate = rates.get(&rate_type).unwrap();

  if rate.remaining == 0 {
    //sleep here for the time in seconds
    let now = SystemTime::now()
      .duration_since(SystemTime::UNIX_EPOCH).unwrap();
    let till = Duration::new(rate.reset,0);
    let seconds_to_wait = Duration::new(till.as_secs()-now.as_secs(),0);
    tokio::time::sleep(seconds_to_wait).await;
  }
  Ok(())
}

fn make_request(method: Method, url: Url, body: Option<String>)-> Request{
  let github_username = match std::env::var("GITHUB_USERNAME"){
    Ok(x) => x,
    Err(_) => "borwe".to_string()
  };
  let github_personal_token = std::env::var("GITHUB_PERSONAL_TOKEN")
    .unwrap();
  let token_header_str = format!("token {}",github_personal_token);

  let mut req: Request = Request::new(method.clone(), url);
  let mut headers = req.headers_mut();
  headers.insert(reqwest::header::AUTHORIZATION,
                 HeaderValue::from_str(token_header_str.as_str()).unwrap());
  
  if let Some(x) = body {
    req.body_mut().insert(Body::from(x));
  }
  req
}

pub async fn get_pull_requests()-> reqwest::Result<Vec<PullRequest>>{
  let mut result = Vec::new();
  let github_username = match std::env::var("GITHUB_USERNAME"){
    Ok(x) => x,
    Err(_) => "borwe".to_string()
  };
  let pr_url = format!(
    "https://api.github.com/search/issues?q=author:{}%20type:pr",
    github_username);

  check_rate_and_sleep(RateResource::Search).await?;
  let client = Client::new();
  let request = make_request(Method::GET,
     Url::parse(pr_url.as_str()).unwrap(), None);

  let response = client.execute(request).await?;
  let headers = response.headers();
  headers.get_all("link").into_iter().for_each(|val|{
    println!("HEADER: {:?}",val);
  });

  let mut json_items = Value::from(response.text().await.unwrap());
  let json_items = json_items["items"].as_array_mut().unwrap();

  for item in json_items.into_iter(){
    let repo_url = Url::parse(item.get("repository_url")
      .unwrap().as_str().unwrap()).unwrap();
    let req = make_request(Method::GET, repo_url, None);

    let resp = client.execute(req).await.unwrap();
    let icon_url = Value::from(resp.text().await.unwrap());
    item["avatar_url"] = serde_json::json!(icon_url["avatar_url"]
     .as_str().unwrap());

    result.push(PullRequest::from(item));
  }

  Ok(result)
}
