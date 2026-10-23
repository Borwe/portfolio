use std::{
    env,
    error::Error,
    process::{Command, exit},
};

fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Pass an argument please");
        exit(-1);
    }

    match args[1].as_str() {
        "portgen" | "port" => {
            let mut child = Command::new("cargo")
                .args(["run", "-p", "portgen"])
                .spawn()?;
            let status = child.wait()?;
            exit(status.code().unwrap());
        }
        "dportgen" | "dport" => {
            let mut cmd = Command::new("cargo")
                .args(["build", "-p", "portgen"])
                .spawn()?;
            let mut status = cmd.wait()?;
            if !status.success() {
                exit(status.code().unwrap());
            }
            cmd = Command::new("raddbg.exe")
                .args(["./target/debug/portgen.exe"])
                .spawn()?;
            status = cmd.wait()?;
            exit(status.code().unwrap());
        }
        _ => {
            eprintln!("Invalid args passed");
        }
    }

    Ok(())
}
