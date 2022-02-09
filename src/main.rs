use actix_web::{web,HttpRequest, HttpServer, Result, App};
use actix_files as afs;
use std::path::Path;
use std::fs;
use std::sync::Arc;
use futures::future;
use dotenv::dotenv;
use tokio_postgres::connect;
use tokio::sync::Mutex;

mod models;
mod constants;
mod services;

async fn files(req: HttpRequest, files: web::Data<Arc<Vec<String>>>)-> Result<afs::NamedFile>{
  let path: String = req.match_info().query("filename").parse().unwrap();
  let mut base_files_dir = String::from("./dist/portfolio/");
  if files.contains(&path) == false {
    base_files_dir.push_str("index.html");
  }else{
    base_files_dir+=&path[..];
  }
  Ok(afs::NamedFile::open(base_files_dir.as_str())?)
}

async fn index()-> Result<afs::NamedFile>{
  Ok(afs::NamedFile::open("./dist/portfolio/index.html")?)
}

fn get_items_in_dir(dir: &Path, items_in_dir: &mut Vec<String>) -> std::io::Result<()> {
  if dir.is_dir() {
    for entry in fs::read_dir(dir)? {
      let entry = entry?;
      let path = entry.path();
      if path.is_dir() {
        get_items_in_dir(&path, items_in_dir)?;
      } else {
        let path = path.to_str().unwrap().to_owned()
          .strip_prefix("./dist/portfolio/").unwrap().to_owned();
        items_in_dir.push(path);
      }
    }
  }
  Ok(())
}

async fn start_db_filling() -> std::io::Result<()>{
  Ok(())
}

async fn start(items_in_dir: Arc::<Vec<String>>) -> std::io::Result<()> {
  startup_setup().await?;
  let server = HttpServer::new(move ||{
    App::new().app_data(actix_web::web::Data::new(Arc::clone(&items_in_dir)))
      .route("/",web::get().to(index))
      .route("/{filename:.*}",web::get().to(files))
  }).bind("0.0.0.0:8080")?.run();

  server.await?;
  Ok(())
}

async fn startup_setup() -> 
  std::io::Result<Arc<Mutex<tokio_postgres::Client>>>{
  let postgres_port = match std::env::var("POSTGRES_PORT") {
    Ok(x) => x,
    Err(_) => "5432".to_string()
  };
  let postgres_password = match std::env::var("POSTGRES_PASSWORD"){
    Ok(x) => x,
    Err(_) => "test".to_string()
  };
  let postgres_user = match std::env::var("POSTGRES_USER"){
    Ok(x) => x,
    Err(_) => "postgres".to_string()
  };
  let postgres_dbname = match std::env::var("POSTGRES_DB"){
    Ok(x) => x,
    Err(_) => "test".to_string()
  };

  let connection_string = std::format!(
    "host=0.0.0.0 user={} password={} port={} dbname={}",
    postgres_user, postgres_password, postgres_port, postgres_dbname);
  let (mut client, connection) = connect(&connection_string,
     tokio_postgres::NoTls).await.unwrap();
  println!("DB connection possible");
  tokio::spawn(async move {
      if let Err(e) = connection.await{
        eprintln!("connection error: {}",e);
      }
  });

  //query for creating pull_requests table if doesn't exist
  let query = concat!("CREATE TABLE IF NOT EXISTS pull_requests (",
      "id SERIAL PRIMARY KEY,",
      "api_url TEXT NOT NULL,",
      "repository TEXT NOT NULL,",
      "icon_url TEXT NOT NULL,",
      "html_url TEXT NOT NULL,",
      "title TEXT NOT NULL,",
      "state TEXT NOT NULL,",
      "comments INT NOT NULL,",
      "created_date TEXT NOT NULL,",
      "body TEXT NOT NULL,",
      "author_association TEXT NOT NULL",
      ");");
  let mut transaction = client.transaction().await.unwrap();
  let prep_statement = transaction.prepare(query).await.unwrap();
  transaction.execute(&prep_statement,&vec![]).await.unwrap();
  transaction.commit().await.unwrap();

  Ok(Arc::new(Mutex::new(client)))
}

fn main() -> std::io::Result<()>{
  dotenv().ok();

  // check if db pr's or projects is empty.
  // if yes, then get the data to fill it up with
  // if not, then proceed to continue scrapping if there
  // is new data.


  // get items that can be served to the db
  let mut items_in_dir = Vec::<String>::new();
  get_items_in_dir(Path::new("./dist/"), &mut items_in_dir)?;
  let items_in_dir = Arc::<Vec<String>>::from(items_in_dir);

  let sys = actix_web::rt::System::with_tokio_rt(move ||{
    //runtime for handling parsing github api, and inserting to db
    tokio::runtime::Builder::new_multi_thread()
      .enable_all()
      .build().unwrap()
  });

  //used for running the main starting point
  let _result = sys.block_on(start(Arc::clone(&items_in_dir)));
  Ok(())
}
