use actix_web::{web,HttpRequest, HttpServer, Result, App};
use actix_files as afs;
use std::path::Path;
use std::fs;

async fn files(req: HttpRequest)-> Result<afs::NamedFile>{
  let path: String = req.match_info().query("filename").parse().unwrap();
  let mut base_files_dir = String::from("./dist/portfolio/");
  base_files_dir+=&path[..];
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
                items_in_dir.push(path.to_str().unwrap().to_owned());
            }
        }
    }
    Ok(())
}

#[actix_web::main]
async fn main() -> std::io::Result<()>{
  let mut items_in_dir = Vec::<String>::new();
  get_items_in_dir(Path::new("./dist/"), &mut items_in_dir)?;

  let server = HttpServer::new(||{
    App::new().route("/",web::get().to(index))
      .route("/{filename:.*}",web::get().to(files))
  }).bind("0.0.0.0:8080")?.run();
  server.await?;
  println!("Hello, world!");
  Ok(())
}
