use actix_web::{web,HttpRequest, HttpServer, Result, App};
use actix_files as afs;

async fn files(req: HttpRequest)-> Result<afs::NamedFile>{
  let path: String = req.match_info().query("filename").parse().unwrap();
  let mut base_files_dir = String::from("./dist/portfolio/");
  base_files_dir+=&path[..];
  Ok(afs::NamedFile::open(base_files_dir.as_str())?)
}

async fn index()-> Result<afs::NamedFile>{
  Ok(afs::NamedFile::open("./dist/portfolio/index.html")?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()>{
    let server = HttpServer::new(||{
      App::new().route("/",web::get().to(index))
        .route("/{filename:.*}",web::get().to(files))
    });
    server.bind("0.0.0.0:8080")?.run().await?;
    println!("Hello, world!");
    Ok(())
}
