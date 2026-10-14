//! HTTP API for SIGIL OS
//!
//! This module provides the HTTP API server for SIGIL OS.

use axum::{
    extract::State,
    response::Json,
    routing::{get, post, put},
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use uuid::Uuid;

/// Health check response
#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
    timestamp: String,
    superbrain_enabled: bool,
}

/// Chat request
#[derive(Deserialize)]
struct ChatRequest {
    prompt: String,
    #[serde(default)]
    max_tokens: u32,
    #[serde(default)]
    temperature: f32,
    #[serde(default)]
    signature: Option<String>,
    #[serde(default)]
    use_superbrain: bool,
    #[serde(default)]
    conversation_id: Option<String>,
    #[serde(default)]
    user_id: Option<String>,
}

/// Chat response
#[derive(Serialize)]
struct ChatResponse {
    text: String,
    tokens_generated: u32,
    duration_ms: u64,
    request_id: String,
    superbrain: Option<SuperBrainInfo>,
}

/// Super Brain info
#[derive(Serialize)]
struct SuperBrainInfo {
    emotional_state: String,
    confidence: f32,
    memory_used: Vec<String>,
    improvement_triggered: bool,
}

/// Super Brain request
#[derive(Deserialize)]
struct SuperBrainRequest {
    prompt: String,
    conversation_id: String,
    user_id: String,
    #[serde(default)]
    include_context: bool,
    #[serde(default)]
    use_personality: bool,
    #[serde(default)]
    enable_memory: bool,
}

/// Super Brain response
#[derive(Serialize)]
struct SuperBrainResponse {
    text: String,
    emotional_state: String,
    reasoning_steps: Vec<String>,
    confidence: f32,
    memory_used: Vec<String>,
    improvement_triggered: bool,
    tokens_generated: u32,
    duration_ms: u64,
}

/// Dream weaving data
#[derive(Serialize)]
struct DreamWeavingData {
    cycles: u32,
    insights: u32,
    evolution_score: f32,
    rollback_points: u32,
}

/// Sigil data
#[derive(Serialize)]
struct SigilData {
    sigils: Vec<SigilEntry>,
    total_count: u32,
}

#[derive(Serialize)]
struct SigilEntry {
    id: String,
    timestamp: String,
    action: String,
    signature: String,
}

/// Avatar settings
#[derive(Deserialize, Serialize)]
struct AvatarSettings {
    style: String,
    skin_tone: String,
    eye_color: String,
    expression: String,
}

/// API state
#[derive(Clone)]
pub struct ApiState {
    pub version: String,
    pub superbrain_enabled: bool,
}

/// Create the API router
pub fn create_router(state: ApiState) -> Router {
    Router::new()
        .route("/health", get(health_check))
        .route("/api/v1/chat", post(chat_endpoint))
        .route("/api/v1/superbrain/chat", post(superbrain_endpoint))
        .route("/api/v1/dream-weaving", get(dream_weaving_endpoint))
        .route("/api/v1/sigils", get(sigils_endpoint))
        .route("/api/v1/avatar", put(avatar_endpoint))
        .route("/api/v1/superbrain/memory", get(superbrain_memory_endpoint))
        .route(
            "/api/v1/superbrain/context",
            get(superbrain_context_endpoint),
        )
        .route(
            "/api/v1/superbrain/personality",
            get(superbrain_personality_endpoint),
        )
        .route(
            "/api/v1/superbrain/improve",
            post(superbrain_improve_endpoint),
        )
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
        superbrain_enabled: state.superbrain_enabled,
    })
}

/// Chat endpoint
async fn chat_endpoint(
    State(_state): State<ApiState>,
    Json(request): Json<ChatRequest>,
) -> Json<ChatResponse> {
    let start = std::time::Instant::now();

    let response_text = format!(
        "I received your message: \"{}\". {}",
        request.prompt,
        if request.use_superbrain {
            "Super Brain would enhance this response with personality and reasoning."
        } else {
            "The ML inference is being integrated with Candle v0.11.0."
        }
    );

    let duration = start.elapsed();

    Json(ChatResponse {
        text: response_text,
        tokens_generated: response_text.len() as u32,
        duration_ms: duration.as_millis() as u64,
        request_id: Uuid::new_v4().to_string(),
        superbrain: if request.use_superbrain {
            Some(SuperBrainInfo {
                emotional_state: "helpful".to_string(),
                confidence: 0.85,
                memory_used: vec![],
                improvement_triggered: false,
            })
        } else {
            None
        },
    })
}

/// Super Brain endpoint
async fn superbrain_endpoint(
    State(_state): State<ApiState>,
    Json(request): Json<SuperBrainRequest>,
) -> Json<SuperBrainResponse> {
    // In production, this would call the actual Super Brain engine
    // For now, return a simulated response with Super Brain features

    let start = std::time::Instant::now();

    let response_text = format!(
        "[Super Brain] I received your message: \"{}\".\n\nThis response would include:\n- Emotional state analysis\n- Personality-driven response\n- Memory retrieval\n- Reasoning steps\n- Confidence scoring\n- Self-improvement triggers",
        request.prompt
    );

    let duration = start.elapsed();

    Json(SuperBrainResponse {
        text: response_text,
        emotional_state: "helpful".to_string(),
        reasoning_steps: vec![
            "1. Analyzed emotional state".to_string(),
            "2. Retrieved relevant memory".to_string(),
            "3. Applied personality traits".to_string(),
            "4. Generated response".to_string(),
            "5. Calculated confidence".to_string(),
        ],
        confidence: 0.85,
        memory_used: vec![],
        improvement_triggered: false,
        tokens_generated: response_text.len() as u32,
        duration_ms: duration.as_millis() as u64,
    })
}

/// Dream weaving endpoint
async fn dream_weaving_endpoint(State(_state): State<ApiState>) -> Json<DreamWeavingData> {
    // In production, this would return actual dream weaving data
    Json(DreamWeavingData {
        cycles: 0,
        insights: 0,
        evolution_score: 0.0,
        rollback_points: 0,
    })
}

/// Sigils endpoint
async fn sigils_endpoint(State(_state): State<ApiState>) -> Json<SigilData> {
    // In production, this would return actual sigil data
    Json(SigilData {
        sigils: vec![],
        total_count: 0,
    })
}

/// Avatar endpoint
async fn avatar_endpoint(
    State(_state): State<ApiState>,
    Json(settings): Json<AvatarSettings>,
) -> Json<AvatarSettings> {
    // In production, this would save avatar settings to the database
    Json(settings)
}

/// Super Brain memory endpoint
async fn superbrain_memory_endpoint(State(_state): State<ApiState>) -> Json<serde_json::Value> {
    // In production, this would return actual memory data
    Json(serde_json::json!({
        "memories": [],
        "total_count": 0
    }))
}

/// Super Brain context endpoint
async fn superbrain_context_endpoint(State(_state): State<ApiState>) -> Json<serde_json::Value> {
    // In production, this would return actual context data
    Json(serde_json::json!({
        "context": "",
        "window_size": 131072
    }))
}

/// Super Brain personality endpoint
async fn superbrain_personality_endpoint(
    State(_state): State<ApiState>,
) -> Json<serde_json::Value> {
    // In production, this would return actual personality data
    Json(serde_json::json!({
        "traits": {
            "curiosity": 0.8,
            "creativity": 0.7,
            "empathy": 0.85
        },
        "emotional_state": "helpful"
    }))
}

/// Super Brain improve endpoint
async fn superbrain_improve_endpoint(State(_state): State<ApiState>) -> Json<serde_json::Value> {
    // In production, this would trigger a self-improvement cycle
    Json(serde_json::json!({
        "improvement_triggered": true,
        "cycle_number": 1,
        "improvements": []
    }))
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
            superbrain_enabled: false,
        };

        let serialized = serde_json::to_string(&response).unwrap();
        assert!(serialized.contains("ok"));
    }
}
