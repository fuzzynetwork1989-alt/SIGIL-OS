//! SIGIL OS API Server
//!
//! Main entry point for the SIGIL OS HTTP API server.

use api::http::{serve, ApiState};
use api::conversation::ConversationStore;
use std::net::SocketAddr;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    println!("🚀 Starting SIGIL OS API Server...");
    println!("🧠 Super Brain: Enabled");
    println!("🔐 Cryptographic Warrants: Active");
    println!("🌐 HTTP Server: Starting...");

    let state = ApiState {
        version: env!("CARGO_PKG_VERSION").to_string(),
        superbrain_enabled: true,
        conversation_store: Arc::new(ConversationStore::new()),
    };

    // Try default port 8080, fall back to alternatives if occupied
    let ports = vec![8080u16, 8081, 8082, 8083, 8084];
    let mut addr = None;

    for port in ports {
        let test_addr = SocketAddr::from(([127, 0, 0, 1], port));
        match tokio::net::TcpListener::bind(&test_addr).await {
            Ok(_) => {
                addr = Some(test_addr);
                println!("📍 Server listening on: http://{}", test_addr);
                break;
            }
            Err(e) => {
                println!("⚠️  Port {} is in use, trying next port...", port);
            }
        }
    }

    let addr = match addr {
        Some(a) => a,
        None => {
            eprintln!("❌ ERROR: All ports 8080-8084 are in use!");
            eprintln!("Please free up one of these ports or specify a different port.");
            std::process::exit(1);
        }
    };

    println!("✅ Server started successfully!");
    println!("📝 Health check: http://{}/health", addr);
    println!("💬 Chat endpoint: http://{}/api/v1/chat", addr);

    if let Err(e) = serve(addr, state).await {
        eprintln!("❌ Server error: {}", e);
        std::process::exit(1);
    }

    Ok(())
}
