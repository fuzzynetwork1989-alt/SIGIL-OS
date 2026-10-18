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

    // Use PORT environment variable for cloud hosting, default to 8080
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    // Bind to 0.0.0.0 for cloud hosting (accepts connections from any interface)
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    println!("📍 Server listening on: http://{}", addr);

    println!("✅ Server started successfully!");
    println!("📝 Health check: http://{}/health", addr);
    println!("💬 Chat endpoint: http://{}/api/v1/chat", addr);

    if let Err(e) = serve(addr, state).await {
        eprintln!("❌ Server error: {}", e);
        std::process::exit(1);
    }

    Ok(())
}
