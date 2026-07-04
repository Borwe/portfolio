use std::{
    env,
    error::Error,
    process::{exit, Command},
};

fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Pass an argument please");
        exit(-1);
    }

    if args[1] == "portgen" || args[1] == "port" {
        let mut child = Command::new("cargo")
            .args(["run", "-p", "portgen"])
            .spawn()?;
        let status = child.wait()?;
        exit(status.code().unwrap());
    }

    Ok(())
}
