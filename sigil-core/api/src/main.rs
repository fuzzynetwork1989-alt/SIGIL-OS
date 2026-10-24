//! SIGIL OS API Server
//!
//! Main entry point for the SIGIL OS HTTP API server.

use api::http::{serve, ApiState};
use api::conversation::ConversationStore;
use config::Config;
use std::net::SocketAddr;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load configuration
    let config = Config::load();

    // Initialize structured logging
    let log_level = config.logging.level.parse::<tracing::Level>()
        .unwrap_or(tracing::Level::INFO);

    tracing_subscriber::fmt()
        .with_max_level(log_level)
        .with_target(true)
        .with_thread_ids(true)
        .init();

    tracing::info!("🚀 Starting SIGIL OS API Server...");
    tracing::info!("🧠 Super Brain: Enabled");
    tracing::info!("🔐 Cryptographic Warrants: {}", if config.sigil.warrants_enabled { "Active" } else { "Disabled" });
    tracing::info!("🌐 HTTP Server: Starting...");

    let state = ApiState {
        version: env!("CARGO_PKG_VERSION").to_string(),
        superbrain_enabled: true,
        conversation_store: Arc::new(ConversationStore::new()),
    };

    // Use configuration for server address
    let addr: SocketAddr = config.server_address().parse()?;

    tracing::info!("📍 Server listening on: http://{}", addr);
    tracing::info!("✅ Server started successfully!");
    tracing::info!("📝 Health check: http://{}/health", addr);
    tracing::info!("💬 Chat endpoint: http://{}/api/v1/chat", addr);

    if let Err(e) = serve(addr, state).await {
        tracing::error!("❌ Server error: {}", e);
        std::process::exit(1);
    }

    Ok(())
}
