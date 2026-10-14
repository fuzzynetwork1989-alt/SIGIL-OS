//! SIGIL OS API Server
//!
//! Main entry point for the SIGIL OS HTTP API server.

use sigil_core_api::http::{serve, ApiState};
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    println!("🚀 Starting SIGIL OS API Server...");
    println!("🧠 Super Brain: Enabled");
    println!("🔐 Cryptographic Warrants: Active");
    println!("🌐 HTTP Server: Starting...");

    let state = ApiState {
        version: env!("CARGO_PKG_VERSION").to_string(),
        superbrain_enabled: true,
    };

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("📍 Server listening on: http://{}", addr);

    serve(addr, state).await?;

    Ok(())
}
