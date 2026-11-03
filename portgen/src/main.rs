use std::{
    env::current_dir,
    fs::{self, DirEntry, File},
    io,
    path::PathBuf,
    time::SystemTime,
};

use axum::{Router, response::Html, routing::get};
use tokio::spawn;

async fn index() -> Html<&'static str> {
    Html("<h3>YOLO</h3>")
}

struct State {
    files: Vec<PathBuf>,
    files_pev: Vec<PathBuf>,
    files_dates: Vec<SystemTime>,
    files_prev_dates: Vec<SystemTime>,
    files_change_index: Vec<usize>,
}

impl State {
    /// Get files from current directory inside layout and docs
    /// directory
    pub fn grep_files(&mut self) {
        let mut other_dirs = Vec::default();
        let mut paths: Vec<PathBuf> = Self::read_dirs(current_dir().unwrap(), &mut other_dirs);

        while !other_dirs.is_empty() {
            if let Some(path_dir) = other_dirs.pop() {
                paths.append(&mut Self::read_dirs(path_dir, &mut other_dirs));
            }
        }

        self.files = paths;
        self.files.sort();
        self.produce_hashes();
    }

    fn produce_hashes(&mut self) {
        self.files_dates.clear();
        for f in self.files.iter() {
            let file = File::open(f).unwrap();
            let metadata = file.metadata().unwrap();
            self.files_dates.push(metadata.modified().unwrap());
        }
    }

    fn read_dirs(path: PathBuf, other_dirs: &mut Vec<PathBuf>) -> Vec<PathBuf> {
        let paths = fs::read_dir(path)
            .unwrap()
            .into_iter()
            .filter_map({
                let other_dirs = other_dirs;
                move |f| Self::filter_and_map_to_dir_entry(f, other_dirs)
            })
            .map(|f| f.path())
            .collect();
        return paths;
    }

    fn filter_and_map_to_dir_entry(
        readir_result: io::Result<DirEntry>,
        other_dirs: &mut Vec<PathBuf>,
    ) -> Option<DirEntry> {
        match readir_result {
            Ok(f) => {
                if f.file_type().unwrap().is_dir() {
                    other_dirs.push(f.path().clone());
                    None
                } else {
                    Some(f)
                }
            }
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
            files_change_index: Default::default(),
        };
        state.grep_files();
        state
    }
}

async fn interval_pinging_changes(state: &mut State) {
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

        println!("LEN_BEF {}", state.files_pev.len());
        println!("LEN_NOW {}", state.files.len());

        let mut used = 0;
        for (i, v_prev) in state.files_pev.iter().enumerate() {
            for (j, v) in state.files[used..].iter().enumerate() {
                //println!("used: {:?}",used);
                if v == v_prev {
                    used = j;
                    if state.files_prev_dates[i] < state.files_dates[j] {
                        state.files_change_index.push(j)
                    }
                    break;
                }
            }
        }

        let end = SystemTime::now();
        let secs = end.duration_since(start).unwrap().as_millis();
        println!("TIME PASSED: {secs}");
    }
}

fn get_mut_ref<'a, T>(ptr: *mut T) -> &'a mut T {
    unsafe { ptr.as_mut::<'a>().unwrap() }
}

#[tokio::main]
async fn main() {
    let mut state = State::default();
    spawn({
        let state = get_mut_ref(&mut state as *mut State);
        interval_pinging_changes(state)
    });

    let router = Router::new().route("/", get(index));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();
    axum::serve(listener, router).await.unwrap();
}

#[cfg(test)]
mod test {
    use std::path::PathBuf;

    use proptest::{collection, prelude::*, string, test_runner::TestRunner};

    #[derive(Debug)]
    enum FileAction {
        IsCreateDir,
        IsCreateFile,
        IsDelete,
        IsEditFile,
        End,
    }

    #[derive(Debug)]
    struct FileActionsInput {
        file_action: FileAction,
        path: String,
    }

    impl FileActionsInput {
        fn new((action, path): (u8, String)) -> Self {
            Self {
                file_action: match action {
                    x if x == FileAction::IsCreateDir as u8 => FileAction::IsCreateDir,
                    x if x == FileAction::IsCreateFile as u8 => FileAction::IsCreateFile,
                    x if x == FileAction::IsDelete as u8 => FileAction::IsDelete,
                    x if x == FileAction::IsEditFile as u8 => FileAction::IsEditFile,
                    _ => unreachable!(),
                },
                path,
            }
        }
    }

    fn test_file_parsing_correctness(inputs: Vec<FileActionsInput>) -> Result<(), TestCaseError> {
        for input in inputs.iter() {
            let d = temp_dir::TempDir::new().unwrap();
            let mut path = d.path();
        }
        Ok(())
    }

    #[test]
    fn file_traversal_prop_test() {
        let mut runner = TestRunner::default();
        runner
            .run(
                &collection::vec(
                    &((0..FileAction::End as u8), "[a-zA-Z0-9]{3,5}")
                        .prop_map(FileActionsInput::new),
                    5..10000,
                ),
                test_file_parsing_correctness,
            )
            .unwrap();
    }
}
