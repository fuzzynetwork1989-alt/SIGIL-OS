//! HTTP API for SIGIL OS
//!
//! This module provides the HTTP API server for SIGIL OS.

use axum::{
    extract::State,
    response::{sse::Event, Json, Sse},
    routing::{delete, get, post, put},
    Router,
};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use uuid::Uuid;
use validator::Validate;

use crate::conversation::{Conversation, ConversationStore, ConversationSummary, Message};

/// Health check response
#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
    timestamp: String,
    superbrain_enabled: bool,
}

/// Chat request
#[derive(Deserialize, Validate)]
struct ChatRequest {
    #[validate(length(min = 1, max = 10000, message = "Prompt must be between 1 and 10000 characters"))]
    prompt: String,
    #[validate(range(min = 1, max = 8192, message = "Max tokens must be between 1 and 8192"))]
    #[serde(default = "default_max_tokens")]
    max_tokens: u32,
    #[validate(range(min = 0.0, max = 2.0, message = "Temperature must be between 0.0 and 2.0"))]
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

fn default_max_tokens() -> u32 {
    1024
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

/// API state with conversation store
#[derive(Clone)]
pub struct ApiState {
    pub version: String,
    pub superbrain_enabled: bool,
    pub conversation_store: Arc<ConversationStore>,
}

/// Create conversation request
#[derive(Deserialize)]
struct CreateConversationRequest {
    user_id: String,
    title: String,
    #[serde(default = "default_model")]
    model: String,
    #[serde(default)]
    superbrain_enabled: bool,
}

fn default_model() -> String {
    "sigil-default".to_string()
}

/// Add message request
#[derive(Deserialize)]
struct AddMessageRequest {
    role: String,
    content: String,
    #[serde(default)]
    tokens: Option<u32>,
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
        .route("/api/v1/conversations", post(create_conversation))
        .route("/api/v1/conversations", get(list_conversations))
        .route("/api/v1/conversations/:id", get(get_conversation))
        .route("/api/v1/conversations/:id", delete(delete_conversation))
        .route("/api/v1/conversations/:id/messages", post(add_message))
        .route("/api/v1/conversations/:id/export", get(export_conversation))
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([
                    axum::http::Method::GET,
                    axum::http::Method::POST,
                    axum::http::Method::PUT,
                    axum::http::Method::DELETE,
                ])
                .allow_headers(Any),
        )
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
) -> Result<Json<ChatResponse>, axum::http::StatusCode> {
    // Validate request
    if let Err(errors) = request.validate() {
        tracing::error!("Validation failed: {:?}", errors);
        return Err(axum::http::StatusCode::BAD_REQUEST);
    }

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

    Ok(Json(ChatResponse {
        text: response_text.clone(),
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
    }))
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
        text: response_text.clone(),
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

/// Streaming chat endpoint (SSE - like ChatGPT)
async fn chat_stream_endpoint(
    State(_state): State<ApiState>,
    Json(request): Json<ChatRequest>,
) -> Sse<impl futures::Stream<Item = Result<Event, anyhow::Error>>> {
    let prompt = request.prompt.clone();
    let use_superbrain = request.use_superbrain;

    // Simulate token-by-token streaming
    let response_text = if use_superbrain {
        format!(
            "[Super Brain] I received your message: \"{}\".\n\nProcessing with personality and reasoning...",
            prompt
        )
    } else {
        format!("I received your message: \"{}\".", prompt)
    };

    let stream = async_stream::try_stream! {
        // Stream token by token
        for token in response_text.split_whitespace() {
            yield Event::default().data(format!("{} ", token));
            tokio::time::sleep(Duration::from_millis(50)).await;
        }
        yield Event::default().data("[DONE]");
    };

    Sse::new(stream)
        .keep_alive(axum::response::sse::KeepAlive::new().interval(Duration::from_secs(10)))
}

/// Create a new conversation
async fn create_conversation(
    State(state): State<ApiState>,
    Json(request): Json<CreateConversationRequest>,
) -> Json<Conversation> {
    let conversation = state.conversation_store.create_conversation(
        request.user_id,
        request.title,
        request.model,
        request.superbrain_enabled,
    );
    Json(conversation)
}

/// List all conversations for a user
async fn list_conversations(
    State(state): State<ApiState>,
    axum::extract::Query(params): axum::extract::Query<std::collections::HashMap<String, String>>,
) -> Json<Vec<ConversationSummary>> {
    let user_id = params
        .get("user_id")
        .unwrap_or(&"default".to_string())
        .clone();
    let conversations = state.conversation_store.list_conversations(&user_id);
    Json(conversations)
}

/// Get a specific conversation
async fn get_conversation(
    State(state): State<ApiState>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<Json<Conversation>, axum::http::StatusCode> {
    match state.conversation_store.get_conversation(&id) {
        Some(conversation) => Ok(Json(conversation)),
        None => Err(axum::http::StatusCode::NOT_FOUND),
    }
}

/// Delete a conversation
async fn delete_conversation(
    State(state): State<ApiState>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<axum::http::StatusCode, axum::http::StatusCode> {
    if state.conversation_store.delete_conversation(&id) {
        Ok(axum::http::StatusCode::NO_CONTENT)
    } else {
        Err(axum::http::StatusCode::NOT_FOUND)
    }
}

/// Add a message to a conversation
async fn add_message(
    State(state): State<ApiState>,
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(request): Json<AddMessageRequest>,
) -> Result<Json<Message>, axum::http::StatusCode> {
    let message = Message {
        id: Uuid::new_v4().to_string(),
        role: request.role,
        content: request.content,
        timestamp: Utc::now(),
        tokens: request.tokens,
    };

    match state.conversation_store.add_message(&id, message.clone()) {
        Ok(_) => Ok(Json(message)),
        Err(_) => Err(axum::http::StatusCode::NOT_FOUND),
    }
}

/// Export a conversation as Markdown
async fn export_conversation(
    State(state): State<ApiState>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<String, axum::http::StatusCode> {
    match state.conversation_store.export_conversation(&id) {
        Ok(markdown) => Ok(markdown),
        Err(_) => Err(axum::http::StatusCode::NOT_FOUND),
    }
}

/// Start the HTTP server
pub async fn serve(addr: SocketAddr, state: ApiState) -> anyhow::Result<()> {
    let app = create_router(state);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    println!("Server bound to {}", addr);
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
