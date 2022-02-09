use std::collections::HashMap;
use serde_json::Value;

pub enum State{
  Open,
  Close
}

pub enum AuthorAssociation{
  Owner,
  Contributer
}

pub struct PullRequest{
  pub api_url: String,
  pub repository: String,
  pub icon_url: String,
  pub html_url: String,
  pub title: String,
  pub state: State,
  pub comments: u64,
  pub created_date: String,
  pub body: String,
  pub author_association: AuthorAssociation
}

impl PullRequest{
  pub fn from(value: &Value) -> Self{
    let api_url: String = value["url"].as_str().unwrap().to_string();
    let repository: String = value["repository_url"].as_str().unwrap().to_string();
    let icon_url: String = value["avatar_url"].as_str().unwrap().to_string();
    let html_url: String = value["html_url"].as_str().unwrap().to_string();
    let title: String = value["title"].as_str().unwrap().to_string();
    let comments: u64 = value["comments"].as_u64().unwrap();
    let created_date: String= value["created_date"].as_str().unwrap().to_string();
    let body: String= value["body"].as_str().unwrap().to_string();
    let mut state: State = State::Open;
    if value["state"].as_str().unwrap() == "close" {
      state = State::Close;
    }
    let mut author_association: AuthorAssociation = AuthorAssociation::Owner;
    if value["author_association"] == "CONTRIBUTOR" {
      author_association = AuthorAssociation::Contributer;
    }

    PullRequest { api_url, repository, icon_url,
      html_url, title, state, comments,
      created_date, body, author_association
    }
  }
}

impl Into<serde_json::Value> for PullRequest{
  fn into(self) -> serde_json::Value {
    let author_association = match self.author_association {
      Contributer => "CONTRIBUTOR",
      Owner => "OWNER"
    };

    let state = match self.state {
      Open => "open",
      Close => "close"
    };
    serde_json::json!({
      "api_url": self.api_url,
      "repository": self.repository,
      "html_url": self.html_url,
      "title": self.title,
      "state": state,
      "comments": self.comments,
      "created_date": self.created_date,
      "body": self.body,
      "author_association": author_association
    })
  }
}

#[derive(Hash, PartialEq, Eq)]
pub enum RateResource{
  Core,
  GraphQl,
  Intergration,
  Search
}

pub struct Rate{
  pub limit: u64,
  pub remaining: u64,
  pub reset: u64,
  pub used: u64,
}

fn insert_to_map(resources: &serde_json::Value, map: &mut HashMap<RateResource,Rate>,
                 section: &str, rate_resource: RateResource){

    let section: &serde_json::Value  = resources.get(section).unwrap();
    map.insert(rate_resource,Rate{
      limit: section.get("limit").unwrap().as_u64().unwrap(),
      remaining: section.get("remaining").unwrap().as_u64().unwrap(),
      reset: section.get("reset").unwrap().as_u64().unwrap(),
      used: section.get("used").unwrap().as_u64().unwrap(),
    });
}

impl Rate {
  pub fn from(val: serde_json::Value)-> HashMap<RateResource,Rate> {
    let mut result = HashMap::new();
    let resources: &serde_json::Value = val.get("resources").unwrap();
    //Core
    insert_to_map(resources, &mut result, "core", RateResource::Core);
    //GraphQl
    insert_to_map(resources, &mut result, "graphql", RateResource::GraphQl);
    //Intergration
    insert_to_map(resources, &mut result, "integration_manifest", RateResource::Intergration);
    //Search
    insert_to_map(resources, &mut result, "search", RateResource::Intergration);
    result
  }
}
