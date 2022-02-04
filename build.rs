use std::process::{Command, Stdio};
use std::env;
use std::ffi::OsString;
use std::path;
use std::cell::RefCell;
use std::rc::Rc;
use dirs;

fn get_os_splitter()->String{
  let mut os_splitter = String::new();
  if env::consts::OS=="windows" {
    os_splitter.push(';');
  }else{
    os_splitter.push(':');
  }
  os_splitter
}

fn turn_back_to_forward_slash(path: &str)->String{
  let mut result = String::new();
  path.chars().for_each(|c|{
    if c=='\\' {
      result.push('/');
    }else{
      result.push(c);
    }
  });
  result
}

fn parse_paths_for_cmd(cmd: &str,path: OsString)->String{
  let os_splitter = get_os_splitter();

  let home_dir = turn_back_to_forward_slash(dirs::home_dir()
    .expect("Sorry, no home dir path variable in your OS")
    .to_str().unwrap());

  let result = Rc::new(RefCell::new(String::new()));
  path.into_string().expect("Couldn't turn OsString path to String")
    .split(os_splitter.as_str()).for_each(|p| { 
      let mut p_expanded = String::new();
      if p.starts_with('~') {
        p_expanded.push_str(home_dir.as_str());
        p_expanded.push('/');
        p_expanded.push_str(&p[2..]);
      }else{
        p_expanded.push_str(&p[..]);
        p_expanded.push('/');
      }
      p_expanded.push_str(cmd);
      if result.borrow().len()==0 && path::Path::new(&p_expanded[..]).exists() {
        result.borrow_mut().push_str(&p_expanded[..]);
      }
  });
  Rc::try_unwrap(result).unwrap().into_inner()
}

fn main()->Result<(),std::io::Error>{
  let path_var: OsString=env::var_os("PATH").expect("Error, no PATH found");
  let ng_cmd = parse_paths_for_cmd("ng",path_var.clone());
  let npm_cmd = parse_paths_for_cmd("npm",path_var.clone());
  println!("CMD: {}",npm_cmd);
  println!("CMD: {}",ng_cmd);
  Command::new(npm_cmd).arg("install").stdout(Stdio::piped())
    .spawn()?;
  Command::new(ng_cmd).arg("build").stdout(Stdio::piped())
    .spawn()?;
  Ok(())
}
