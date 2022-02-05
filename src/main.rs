use actix_web::{web,HttpRequest, HttpServer, Result, App};
use actix_files as afs;
use std::path::Path;
use std::fs;
use std::sync::Arc;
use futures::future;

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

async fn get_data_from_github() -> std::io::Result<()>{
  std::thread::sleep(std::time::Duration::from_secs(40));
  println!("Hello, world!");
  Ok(())
}

async fn start_db_filling() -> std::io::Result<()>{
  Ok(())
}

#[actix_web::main]
async fn main() -> std::io::Result<()>{
  // get items that can be served to the db
  let mut items_in_dir = Vec::<String>::new();
  get_items_in_dir(Path::new("./dist/"), &mut items_in_dir)?;
  let items_in_dir = Arc::<Vec<String>>::from(items_in_dir);

  // check if db pr's or projects is empty.
  // if yes, then get the data to fill it up with
  // if not, then proceed to continue scrapping if there
  // is new data.

  let get_data_fut = get_data_from_github();

  let server = HttpServer::new(move ||{
    App::new().data(Arc::clone(&items_in_dir))
      .route("/",web::get().to(index))
      .route("/{filename:.*}",web::get().to(files))
  }).bind("0.0.0.0:8080")?.run();

  let output = future::join(get_data_fut,server);
  let (get_data_result, server_result) = output.await;
  get_data_result?;
  server_result?;
  Ok(())
}
