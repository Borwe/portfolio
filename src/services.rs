use reqwest::{Client, Response, Result};
use crate::constants;
use crate::models::{Rate,RateResource};
use std::collections::HashMap;
use std::time::{SystemTime, Duration};

pub async fn check_rate_and_sleep(rate_type: RateResource)-> Result<()>{
  let client = Client::new();
  let response: Response = client.get(constants::RATE_URL).send().await?;
  let json_response = serde_json::Value::from(response.text().await?);
  let rates: HashMap<RateResource, Rate> = Rate::from(json_response);
  let rate: &Rate = rates.get(&rate_type).unwrap();

  if rate.remaining == 0 {
    //sleep here for the time in seconds
    let now = SystemTime::now()
      .duration_since(SystemTime::UNIX_EPOCH).unwrap();
    let till = Duration::new(rate.reset,0);
    let seconds_to_wait = Duration::new(till.as_secs()-now.as_secs(),0);
    tokio::time::sleep(seconds_to_wait);
  }
  Ok(())
}
