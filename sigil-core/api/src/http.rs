//! HTTP API for SIGIL OS
//!
//! This module provides the HTTP API server for SIGIL OS.

use axum::{
    extract::State,
    response::Json,
    routing::get,
    Router,
};
use serde::Serialize;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

/// Health check response
#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
    timestamp: String,
}

/// API state
#[derive(Clone)]
pub struct ApiState {
    pub version: String,
}

/// Create the API router
pub fn create_router(state: ApiState) -> Router {
    Router::new()
        .route("/health", get(health_check))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(state)
}

/// Health check endpoint
async fn health_check(State(state): State<ApiState>) -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        version: state.version,
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

/// Start the HTTP server
pub async fn serve(addr: SocketAddr, state: ApiState) -> anyhow::Result<()> {
    let app = create_router(state);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_health_response_serialization() {
        let response = HealthResponse {
            status: "ok".to_string(),
            version: "0.1.0".to_string(),
            timestamp: chrono::Utc::now().to_rfc3339(),
        };

        let serialized = serde_json::to_string(&response).unwrap();
        assert!(serialized.contains("ok"));
    }
}
