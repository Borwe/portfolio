use std::{
    env::current_dir,
    fmt::Display,
    fs::{self, DirEntry, File},
    io,
    path::PathBuf,
    time::SystemTime,
};

use axum::{Router, response::Html, routing::get};
use tokio::spawn;

#[derive(Debug)]
struct CodeSection {
    code_type: Option<&'static str>,
    code: &'static str,
}

#[derive(Debug)]
struct ImageSection {
    alt: &'static str,
    location: &'static str,
}

#[derive(Debug)]
struct LinkSection {
    alt: &'static str,
    location: &'static str,
}

#[derive(Debug)]
enum AST {
    Header1(&'static str),
    Header2(&'static str),
    Header3(&'static str),
    Header4(&'static str),
    Text(&'static str),
    List(u32, Vec<AST>),
    Code(&'static str),
    CodeBlock(CodeSection),
    Image(ImageSection),
    Link(LinkSection),
}

impl Display for AST {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AST::Header1(s) => write!(f, "# {s}\n").unwrap(),
            AST::Header2(s) => write!(f, "## {s}\n").unwrap(),
            AST::Header3(s) => write!(f, "### {s}\n").unwrap(),
            AST::Header4(s) => write!(f, "#### {s}\n").unwrap(),
            AST::Text(s) => write!(f, "{s}\n").unwrap(),
            AST::List(asts) => {
                asts.iter().for_each(|ast| ast.fmt(f).unwrap());
            }
            AST::CodeBlock(code_section) => write!(
                f,
                "```{}\n{}```",
                code_section.code_type.unwrap_or(""),
                code_section.code
            )
            .unwrap(),
            AST::Image(image_section) => {
                write!(f, "![{}]({})", image_section.alt, image_section.location).unwrap()
            }
            AST::Link(link_section) => {
                write!(f, "[{}]({})", link_section.alt, link_section.location).unwrap()
            }
            AST::Code(s) => write!(f, "`{}`", s).unwrap(),
        }
        Ok(())
    }
}

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
    use std::{cell::UnsafeCell, env, io::Write, time::Duration};

    use super::*;
    use proptest::{collection, prelude::*, strategy::TupleUnion, test_runner::TestRunner};
    use tokio::time::{Instant, sleep_until};

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
        spawn(async move {
            let d = temp_dir::TempDir::new().unwrap();
            let path = d.path();
            env::set_current_dir(path).unwrap();
            let mut paths: Vec<String> = vec![];
            let mut paths_dates: Vec<SystemTime> = vec![];
            let mut state = UnsafeCell::new(State::default());

            let handle = spawn(unsafe {
                let state = state.get().as_mut().unwrap();
                async move { interval_pinging_changes(state) }
            });

            let mut cwd = path.to_path_buf();
            for input in inputs.iter() {
                match input.file_action {
                    FileAction::IsCreateDir => {
                        let new_dir = path.join(input.path.clone());
                        cwd = new_dir;
                    }
                    FileAction::IsCreateFile => {
                        let file_path = cwd.join(input.path.clone());
                        if std::fs::exists(file_path.clone()).unwrap() {
                            continue;
                        }
                        let mut file = File::open(file_path.clone()).unwrap();
                        let file_path_str = file_path.as_os_str().to_str().unwrap();
                        file.write(file_path_str.as_bytes()).unwrap();
                        paths.push(file_path_str.to_string());

                        paths_dates.push(file.metadata().unwrap().modified().unwrap());
                    }
                    FileAction::IsDelete => {
                        if let Some(file_path) = paths.pop() {
                            paths_dates.pop();
                            fs::remove_file(file_path).unwrap();
                        }
                    }
                    FileAction::IsEditFile => {
                        if let Some(file_path) = paths.pop() {
                            paths_dates.pop();
                            let mut file = File::open(file_path.clone()).unwrap();
                            file.write(format!("\n{}", file_path).as_bytes()).unwrap();
                            paths.push(file_path);
                            paths_dates.push(file.metadata().unwrap().modified().unwrap());
                        }
                    }
                    FileAction::End => unreachable!("Should never evaluate"),
                }
            }

            sleep_until(Instant::now() + Duration::from_secs(1)).await;
            handle.abort();

            assert!(paths.len() > 0);

            assert_eq!(
                paths.len(),
                state.get_mut().files.len(),
                "state should have same number of files"
            );
            assert_eq!(
                paths_dates.len(),
                state.get_mut().files_dates.len(),
                "state should have same number of dates"
            );
            assert_eq!(
                paths.len(),
                paths_dates.len(),
                "path should have same count as paths_date"
            );

            for i in 0..paths.len() {
                assert_eq!(paths.get(i).unwrap(), state.get_mut().files.get(i).unwrap());
                assert_eq!(
                    paths_dates.get(i).unwrap(),
                    state.get_mut().files_dates.get(i).unwrap()
                );
            }
        });

        Ok(())
    }

    #[tokio::test]
    async fn file_traversal_prop_test() {
        let mut runner = TestRunner::default();
        runner
            .run(
                &collection::vec(
                    &((0..FileAction::End as u8), "[a-zA-Z0-9]{3,5}")
                        .prop_map(FileActionsInput::new),
                    100..10000,
                ),
                test_file_parsing_correctness,
            )
            .unwrap();
    }

    fn mark_down_gen() -> impl Strategy<Value = AST> {
        let md_ast = prop_oneof![
            ".*".prop_map(|s| AST::Header1(s.leak())),
            ".*".prop_map(|s| AST::Header2(s.leak())),
            ".*".prop_map(|s| AST::Header3(s.leak())),
            ".*".prop_map(|s| AST::Header4(s.leak())),
            ".*".prop_map(|s| AST::Text(s.leak())),
            ".*".prop_map(|s| AST::Code(s.leak())),
            (".*", ".*", any::<bool>()).prop_map(|(s1, s2, set)| AST::CodeBlock(CodeSection {
                code_type: if set { Some(s1.leak()) } else { None },
                code: s2.leak()
            })),
            (".*", ".*").prop_map(|(s1, s2)| AST::CodeBlock(CodeSection {
                code_type: Some(s1.leak()),
                code: s2.leak()
            })),
        ];

        //recursive for the List
        md_ast.prop_recursive()
    }

    #[test]
    fn test_markdown_parsing() {}
}
