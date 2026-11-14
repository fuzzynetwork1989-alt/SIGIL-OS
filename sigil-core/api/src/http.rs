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

use persistence::Ledger;
use sigil::{SigilKind, SigilManager};

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

/// API state with conversation store and sigil ledger
#[derive(Clone)]
pub struct ApiState {
    pub version: String,
    pub superbrain_enabled: bool,
    pub conversation_store: Arc<ConversationStore>,
    pub sigil_manager: Arc<SigilManager>,
    pub ledger: Arc<std::sync::Mutex<Ledger>>,
    pub warrants_enabled: bool,
    pub ledger_enabled: bool,
}

impl ApiState {
    /// Create API state with an open sigil ledger
    ///
    /// `ledger_path` selects the SQLite ledger file. Warrants and ledger
    /// emission are controlled by the `warrants_enabled` and
    /// `ledger_enabled` flags.
    pub fn new(
        version: String,
        superbrain_enabled: bool,
        warrants_enabled: bool,
        ledger_enabled: bool,
        ledger_path: &str,
        identity_path: Option<&std::path::Path>,
    ) -> anyhow::Result<Self> {
        let ledger = Ledger::open(ledger_path)?;

        let sigil_manager = match identity_path {
            Some(path) => Arc::new(SigilManager::load_or_create(path)?),
            None => Arc::new(SigilManager::new(Uuid::new_v4(), Uuid::new_v4())),
        };

        Ok(Self {
            version,
            superbrain_enabled,
            conversation_store: Arc::new(ConversationStore::new()),
            sigil_manager,
            ledger: Arc::new(std::sync::Mutex::new(ledger)),
            warrants_enabled,
            ledger_enabled,
        })
    }

    /// Create API state from an already-open ledger
    pub fn with_ledger(
        version: String,
        superbrain_enabled: bool,
        warrants_enabled: bool,
        ledger_enabled: bool,
        ledger: Ledger,
    ) -> Self {
        let device_id = Uuid::new_v4();
        let actor_id = Uuid::new_v4();

        Self {
            version,
            superbrain_enabled,
            conversation_store: Arc::new(ConversationStore::new()),
            sigil_manager: Arc::new(SigilManager::new(device_id, actor_id)),
            ledger: Arc::new(std::sync::Mutex::new(ledger)),
            warrants_enabled,
            ledger_enabled,
        }
    }

    /// Default ledger path from `SIGIL_LEDGER_PATH` or `sigil-ledger.db`
    pub fn default_ledger_path() -> String {
        std::env::var("SIGIL_LEDGER_PATH")
            .unwrap_or_else(|_| "sigil-ledger.db".to_string())
    }
}

/// Emit a signed action sigil for an API state change into the ledger
///
/// Returns an error when warrants/ledger are enabled but emission fails —
/// callers must surface that failure rather than silently dropping it.
fn emit_state_sigil(
    state: &ApiState,
    capability: &str,
    resource_id: Option<Uuid>,
    outcome: &str,
) -> anyhow::Result<()> {
    if !state.warrants_enabled || !state.ledger_enabled {
        return Ok(());
    }

    let sigil = state.sigil_manager.create_action_sigil(
        capability.to_string(),
        resource_id,
        "api_state_change".to_string(),
        Utc::now() + chrono::Duration::hours(1),
        outcome.to_string(),
        1.0,
        vec![],
        vec![],
        vec![capability.to_string()],
    )?;

    state.ledger.lock().unwrap().append(&sigil)
}

/// Emit a signed inference sigil into the ledger
///
/// Same failure contract as `emit_state_sigil`: when warrants/ledger are
/// enabled, an emission failure is returned to the caller.
fn emit_inference_sigil(
    state: &ApiState,
    model: sigil::ModelTier,
    criterion: &str,
    trace_steps: Vec<(String, String, String)>,
    sources: Vec<String>,
) -> anyhow::Result<()> {
    if !state.warrants_enabled || !state.ledger_enabled {
        return Ok(());
    }

    let sigil = state.sigil_manager.create_inference_sigil(
        model,
        criterion.to_string(),
        trace_steps,
        vec![],
        vec![],
        sources,
    )?;

    state.ledger.lock().unwrap().append(&sigil)
}

/// Emit a signed improvement sigil into the ledger
fn emit_improvement_sigil(
    state: &ApiState,
    variant_description: &str,
    descent_proof: Vec<u8>,
    probation_cycles: u32,
    sources: Vec<String>,
) -> anyhow::Result<()> {
    if !state.warrants_enabled || !state.ledger_enabled {
        return Ok(());
    }

    let sigil = state.sigil_manager.create_improvement_sigil(
        variant_description.to_string(),
        descent_proof,
        probation_cycles,
        vec![],
        vec![],
        sources,
    )?;

    state.ledger.lock().unwrap().append(&sigil)
}

/// Collect all sigils from the ledger for the sigils endpoint
fn collect_sigils(state: &ApiState) -> anyhow::Result<Vec<sigil::Sigil>> {
    state.ledger.lock().unwrap().get_all()
}

/// Human-readable name for a sigil kind
fn sigil_kind_name(kind: &SigilKind) -> &'static str {
    match kind {
        SigilKind::Belief { .. } => "belief",
        SigilKind::Action { .. } => "action",
        SigilKind::Memory { .. } => "memory",
        SigilKind::Inference { .. } => "inference",
        SigilKind::Improvement { .. } => "improvement",
    }
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
        .route("/api/v1/sigils/verify", get(sigils_verify_endpoint))
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
    State(state): State<ApiState>,
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

    // Emit a signed inference sigil for this cognitive act
    let model_tier = if request.use_superbrain {
        sigil::ModelTier::CloudLarge
    } else {
        sigil::ModelTier::OnDeviceSmall
    };
    let trace_steps = vec![
        (
            "prompt_received".to_string(),
            request.prompt.clone(),
            "validated".to_string(),
        ),
        (
            "response_generated".to_string(),
            "inference_pipeline".to_string(),
            response_text.clone(),
        ),
    ];
    if let Err(e) = emit_inference_sigil(
        &state,
        model_tier,
        "chat_response_quality",
        trace_steps,
        vec!["api:/api/v1/chat".to_string()],
    ) {
        tracing::error!("Failed to emit inference sigil for chat: {}", e);
        return Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR);
    }

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
async fn sigils_endpoint(
    State(state): State<ApiState>,
) -> Result<Json<SigilData>, axum::http::StatusCode> {
    let sigils = collect_sigils(&state)
        .map_err(|e| {
            tracing::error!("Failed to read sigil ledger: {}", e);
            axum::http::StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let entries = sigils
        .iter()
        .map(|s| SigilEntry {
            id: s.id.to_string(),
            timestamp: s.issued_at.to_rfc3339(),
            action: sigil_kind_name(&s.kind).to_string(),
            signature: hex::encode(&s.signature.bytes),
        })
        .collect();

    Ok(Json(SigilData {
        sigils: entries,
        total_count: sigils.len() as u32,
    }))
}

/// Ledger verification result
#[derive(Serialize)]
struct SigilVerifyData {
    valid: bool,
    total_count: u64,
    verified_at: String,
}

/// Sigils verify endpoint — checks every sigil signature in the ledger
async fn sigils_verify_endpoint(
    State(state): State<ApiState>,
) -> Result<Json<SigilVerifyData>, axum::http::StatusCode> {
    let ledger = state.ledger.lock().unwrap();
    let valid = ledger.verify_integrity().map_err(|e| {
        tracing::error!("Ledger verification failed: {}", e);
        axum::http::StatusCode::INTERNAL_SERVER_ERROR
    })?;
    let total_count = ledger.count().map_err(|e| {
        tracing::error!("Failed to count ledger sigils: {}", e);
        axum::http::StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(SigilVerifyData {
        valid,
        total_count,
        verified_at: Utc::now().to_rfc3339(),
    }))
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
async fn superbrain_improve_endpoint(
    State(state): State<ApiState>,
) -> Result<Json<serde_json::Value>, axum::http::StatusCode> {
    // Emit a signed improvement sigil for the self-improvement cycle
    let descent_proof = format!(
        "superbrain_improve_cycle:{}",
        Utc::now().to_rfc3339()
    )
    .into_bytes();
    if let Err(e) = emit_improvement_sigil(
        &state,
        "superbrain_self_improvement_cycle",
        descent_proof,
        1,
        vec!["api:/api/v1/superbrain/improve".to_string()],
    ) {
        tracing::error!("Failed to emit improvement sigil: {}", e);
        return Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR);
    }

    // In production, this would trigger a self-improvement cycle
    Ok(Json(serde_json::json!({
        "improvement_triggered": true,
        "cycle_number": 1,
        "improvements": []
    })))
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
) -> Result<Json<Conversation>, axum::http::StatusCode> {
    let conversation = state.conversation_store.create_conversation(
        request.user_id,
        request.title,
        request.model,
        request.superbrain_enabled,
    );

    let resource_id = Uuid::parse_str(&conversation.id).ok();
    if let Err(e) = emit_state_sigil(
        &state,
        "conversation.create",
        resource_id,
        "conversation_created",
    ) {
        tracing::error!("Failed to emit sigil for conversation.create: {}", e);
        return Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(Json(conversation))
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
        let resource_id = Uuid::parse_str(&id).ok();
        if let Err(e) = emit_state_sigil(
            &state,
            "conversation.delete",
            resource_id,
            "conversation_deleted",
        ) {
            tracing::error!("Failed to emit sigil for conversation.delete: {}", e);
            return Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR);
        }
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
        Ok(_) => {
            let resource_id = Uuid::parse_str(&id).ok();
            if let Err(e) = emit_state_sigil(
                &state,
                "conversation.message",
                resource_id,
                "message_added",
            ) {
                tracing::error!("Failed to emit sigil for conversation.message: {}", e);
                return Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR);
            }
            Ok(Json(message))
        }
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

    fn test_state() -> (ApiState, tempfile::NamedTempFile) {
        let file = tempfile::NamedTempFile::new().unwrap();
        let ledger = Ledger::open(file.path().to_str().unwrap()).unwrap();
        let state = ApiState::with_ledger(
            "test".to_string(),
            false,
            true,
            true,
            ledger,
        );
        (state, file)
    }

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

    #[test]
    fn test_emit_state_sigil_appends_to_ledger() {
        let (state, _file) = test_state();

        emit_state_sigil(&state, "conversation.create", Some(Uuid::new_v4()), "conversation_created")
            .unwrap();

        let ledger = state.ledger.lock().unwrap();
        assert_eq!(ledger.count().unwrap(), 1);
        assert!(ledger.verify_integrity().unwrap());
    }

    #[test]
    fn test_collect_sigils_returns_entries() {
        let (state, _file) = test_state();

        emit_state_sigil(&state, "conversation.create", Some(Uuid::new_v4()), "conversation_created")
            .unwrap();
        emit_state_sigil(&state, "conversation.delete", None, "conversation_deleted")
            .unwrap();

        let sigils = collect_sigils(&state).unwrap();
        assert_eq!(sigils.len(), 2);
        assert!(matches!(sigils[0].kind, SigilKind::Action { .. }));
        assert_eq!(sigil_kind_name(&sigils[0].kind), "action");
    }

    #[test]
    fn test_emit_state_sigil_disabled_is_noop() {
        let file = tempfile::NamedTempFile::new().unwrap();
        let ledger = Ledger::open(file.path().to_str().unwrap()).unwrap();
        let state = ApiState::with_ledger(
            "test".to_string(),
            false,
            false, // warrants disabled
            true,
            ledger,
        );

        emit_state_sigil(&state, "conversation.create", None, "conversation_created").unwrap();
        assert_eq!(state.ledger.lock().unwrap().count().unwrap(), 0);
    }

    #[test]
    fn test_emit_inference_sigil_appends_to_ledger() {
        let (state, _file) = test_state();

        emit_inference_sigil(
            &state,
            sigil::ModelTier::OnDeviceSmall,
            "chat_response_quality",
            vec![(
                "step".to_string(),
                "input".to_string(),
                "output".to_string(),
            )],
            vec!["api:test".to_string()],
        )
        .unwrap();

        let ledger = state.ledger.lock().unwrap();
        assert_eq!(ledger.count().unwrap(), 1);
        let sigils = ledger.get_all().unwrap();
        assert!(matches!(sigils[0].kind, SigilKind::Inference { .. }));
        assert_eq!(sigil_kind_name(&sigils[0].kind), "inference");
        assert!(ledger.verify_integrity().unwrap());
    }

    #[test]
    fn test_emit_improvement_sigil_appends_to_ledger() {
        let (state, _file) = test_state();

        emit_improvement_sigil(
            &state,
            "test_variant",
            b"proof".to_vec(),
            3,
            vec!["api:test".to_string()],
        )
        .unwrap();

        let ledger = state.ledger.lock().unwrap();
        assert_eq!(ledger.count().unwrap(), 1);
        let sigils = ledger.get_all().unwrap();
        assert!(matches!(sigils[0].kind, SigilKind::Improvement { .. }));
        assert_eq!(sigil_kind_name(&sigils[0].kind), "improvement");
    }
}
