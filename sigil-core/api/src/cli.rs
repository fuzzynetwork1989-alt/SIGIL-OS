//! CLI interface for SIGIL OS
//!
//! This module provides the command-line interface for SIGIL OS.

use clap::{Parser, Subcommand};

/// SIGIL OS - The Post-AI Operating System with Cryptographic Warrant
#[derive(Parser, Debug)]
#[command(name = "sigil")]
#[command(about = "SIGIL OS - The Post-AI Operating System with Cryptographic Warrant", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Check system health
    Health {
        /// Address to connect to (default: http://localhost:8080)
        #[arg(short, long, default_value = "http://localhost:8080")]
        addr: String,
    },
    /// Start the API server
    Serve {
        /// Address to bind to (default: 0.0.0.0:8080)
        #[arg(short, long, default_value = "0.0.0.0:8080")]
        addr: String,
    },
}

/// Run the CLI
pub async fn run() -> anyhow::Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Health { addr } => {
            // TODO: Implement health check
            println!("Checking health at {}", addr);
            Ok(())
        }
        Commands::Serve { addr } => {
            let addr: SocketAddr = addr.parse()?;
            let state = super::http::ApiState {
                version: env!("CARGO_PKG_VERSION").to_string(),
            };
            super::http::serve(addr, state).await?;
            Ok(())
        }
    }
}

use std::net::SocketAddr;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cli_parsing() {
        let cli = Cli::try_parse_from(["sigil", "health"]).unwrap();
        matches!(cli.command, Commands::Health { .. });
    }
}
