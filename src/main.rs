use actix_web::{web,HttpRequest, HttpServer, Result, App};
use actix_files as afs;
use std::path::Path;
use std::fs;
use std::sync::Arc;

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

#[actix_web::main]
async fn main() -> std::io::Result<()>{
  let mut items_in_dir = Vec::<String>::new();
  get_items_in_dir(Path::new("./dist/"), &mut items_in_dir)?;

  let items_in_dir = Arc::<Vec<String>>::from(items_in_dir);

  let server = HttpServer::new(move ||{
    App::new().data(Arc::clone(&items_in_dir))
      .route("/",web::get().to(index))
      .route("/{filename:.*}",web::get().to(files))
  }).bind("0.0.0.0:8080")?.run();
  server.await?;
  println!("Hello, world!");
  Ok(())
}
