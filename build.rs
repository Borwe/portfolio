use std::process::{Command, Stdio};
use std::env;
use std::ffi::OsString;
use std::fs;
use std::cell::RefCell;
use std::rc::Rc;
use dirs;

fn get_ng_bin(path: OsString)->String{
  let mut os_splitter = String::new();
  if env::consts::OS=="windows" {
    os_splitter.push(';');
  }else{
    os_splitter.push(':');
  }
  let home_dir = Rc::new(RefCell::new(String::new()));
  String::from(dirs::home_dir()
    .expect("Sorry, no home dir path variable in your OS")
    .to_str().unwrap()).chars().for_each(|c|{
    if c=='\\' {
      home_dir.borrow_mut().push('/');
    }else{
      home_dir.borrow_mut().push(c);
    }
  });
  let home_dir = Rc::try_unwrap(home_dir).unwrap().into_inner();

  let os_splitter = os_splitter;
  let result = Rc::new(RefCell::new(String::new()));
  let result_copy = result.clone();

  path.into_string().expect("Couldn't turn OsString path to String")
    .split(os_splitter.as_str()).for_each(move |p| { 
      let mut p_expanded = String::new();
      if p.starts_with('~') {
        p_expanded.push_str(home_dir.as_str());
        p_expanded.push('/');
        p_expanded.push_str(&p[2..]);
      }else{
        p_expanded.push_str(&p[..]);
      }
      p_expanded.push_str("/ng");
      if let Ok(_x) = fs::File::open(p_expanded.clone()) {
        if result_copy.borrow().len() == 0 {
          result_copy.borrow_mut().push_str(p_expanded.as_str());
        }
      }
  });

  Rc::try_unwrap(result).unwrap().into_inner()
}

fn main()->Result<(),std::io::Error>{
  let path_var: OsString=env::var_os("PATH").expect("Error, no PATH found");
  let bin_cmd = get_ng_bin(path_var);
  println!("CMD: {}",bin_cmd);
  Command::new(bin_cmd).arg("build").stdout(Stdio::piped())
    .spawn()?;
  Ok(())
}
