use std::{alloc::{Layout, alloc}, cell::RefCell, env::current_dir, ffi::OsStr, fs::{self, DirEntry, File, ReadDir}, io, iter::{self, FilterMap}, path::PathBuf, rc::Rc, sync::Arc, time::{Duration, SystemTime}, usize};

use axum::{Router, response::Html, routing::get};
use tokio::{spawn, time::sleep};

async fn index()-> Html<&'static str> {
    Html("<h3>YOLO</h3>")
}

struct State{
    files: Vec<PathBuf>,
    files_pev: Vec<PathBuf>,
    files_dates: Vec<SystemTime>,
    files_prev_dates: Vec<SystemTime>,
    files_change_index: Vec<usize>
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
                paths.append(&mut Self::read_dirs(path_dir, &mut other_dirs));
            }
        }

        self.files = paths;
        self.files.sort();
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
        let mut state = Self {
            files: Default::default(),
            files_dates: Default::default(),
            files_prev_dates: Default::default(),
            files_pev: Default::default(),
            files_change_index: Default::default()
        };
        state.grep_files();
        state
    }

}

async fn interval_pinging_changes(state: &mut State){
    loop {
        let start = SystemTime::now();
        {
            state.files_pev.clear();
            state.files_prev_dates.clear();
            state.files_change_index.clear();
        }

        state.files_pev.append(&mut state.files);
        state.files_prev_dates.append(&mut state.files_dates);
        println!("YOLO");

        state.grep_files();

        {
            state.files_change_index.clear();
            state.files_change_index.reserve(state.files.len());
        }

        println!("LEN_BEF {}",state.files_pev.len());
        println!("LEN_NOW {}",state.files.len());

        let mut used = 0;
        for (i, v_prev) in state.files_pev.iter().enumerate() {
            for(j, v) in state.files[used..].iter().enumerate() {
                //println!("used: {:?}",used);
                if v==v_prev{
                    used = j;
                    if state.files_prev_dates[i] < state.files_dates[j] {
                        state.files_change_index.push(j)
                    }
                    break
                }
            }
        }


        let end = SystemTime::now();
        let secs = end.duration_since(start).unwrap().as_secs();
        println!("TIME PASSED: {secs}");
    }
}

fn get_mut_ref<'a,T>(ptr: *mut T)-> &'a mut T{
    unsafe {
        ptr.as_mut::<'a>().unwrap()
    }
}

#[tokio::main]
async fn main() {
    let state = unsafe { alloc(Layout::new::<State>()) as *mut State };
    spawn({
        let state = get_mut_ref(state);
        async move {
            interval_pinging_changes(state).await
        }
    });

    let router = Router::new().route("/", get(index));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await.unwrap();
    axum::serve(listener, router).await.unwrap();
}
