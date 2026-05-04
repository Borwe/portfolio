use std::{cell::RefCell, env::current_dir, ffi::OsStr, fs::{self, DirEntry, File, ReadDir}, io, iter::{self, FilterMap}, path::PathBuf, rc::Rc, time::SystemTime};

use axum::{Router, response::Html, routing::get};
use sha256::try_digest;

async fn index()-> Html<&'static str> {
    Html("<h3>YOLO</h3>")
}

struct State{
    files: Vec<PathBuf>,
    files_pev: Option<Vec<PathBuf>>,
    files_dates: Vec<SystemTime>,
    files_prev_dates: Vec<SystemTime>
}

impl State {
    /// Get files from current directory inside layout and docs
    /// directory
    pub fn grep_files(&mut self){
        let mut other_dirs = Vec::default();
        let mut paths: Vec<PathBuf> = Self::read_dirs(current_dir().unwrap(),
            &mut other_dirs);

        while !other_dirs.is_empty() {
            if let Some(path_dir) = other_dirs.pop() {
                println!("DIR {}", path_dir.to_str().unwrap());
                paths.append(&mut Self::read_dirs(path_dir, &mut other_dirs));
            }
        }

        self.files = paths;
        self.produce_hashes();
    }

    fn produce_hashes(&mut self){
        self.files_dates.clear();
        for f in self.files.iter(){
            let file = File::open(f).unwrap();
            let metadata = file.metadata().unwrap();
            self.files_dates.push(metadata.modified().unwrap());
        }
    }

    fn read_dirs(path: PathBuf, other_dirs: &mut Vec<PathBuf>)-> Vec<PathBuf>{
        let paths = fs::read_dir(path)
            .unwrap().into_iter().filter_map({
                let other_dirs = other_dirs;
                move |f| Self::filter_and_map_to_dir_entry(f, other_dirs)})
            .map( |f| {
                f.path()
            }).collect();
        return paths
    }

    fn filter_and_map_to_dir_entry(readir_result: io::Result<DirEntry>,
        other_dirs: &mut Vec<PathBuf>)-> Option<DirEntry>{
        match readir_result {
            Ok(f) => {
                if f.file_type().unwrap().is_dir() {
                    other_dirs.push(f.path().clone());
                    None
                }else{
                    Some(f)
                }
            },
            Err(_) => None,
        }
    }
}

impl Default for State {
    fn default() -> Self {
        println!("HMMMMMM");
        let mut state = Self {
            files: Default::default(),
            files_dates: Default::default(),
            files_prev_dates: Default::default(),
            files_pev: Default::default()
        };
        state.grep_files();
        for f in state.files.iter() {
            println!("{}",f.as_os_str().to_string_lossy());
        }
        println!("DONE!!!");
        state
    }

}


#[tokio::main]
async fn main() {
    let mut state = State::default();

    let router = Router::new().route("/", get(index));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await.unwrap();
    axum::serve(listener, router).await.unwrap();
}
