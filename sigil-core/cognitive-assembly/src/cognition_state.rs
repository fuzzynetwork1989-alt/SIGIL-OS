//! Cognition State - represents a temporary mind state

/// Cognition State - a temporary mind state for a task
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct CognitionState {
    pub id: uuid::Uuid,
    pub task_id: uuid::Uuid,
    pub identity_context: serde_json::Value,
    pub memory_context: Vec<MemoryContext>,
    pub mission_context: Vec<MissionContext>,
    pub world_state: serde_json::Value,
    pub spatial_state: serde_json::Value,
    pub active_goals: Vec<Goal>,
    pub user_intent: String,
    pub assembled_at: chrono::DateTime<chrono::Utc>,
}

/// Memory context
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MemoryContext {
    pub memory_id: uuid::Uuid,
    pub relevance_score: f64,
    pub content: String,
}

/// Mission context
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MissionContext {
    pub mission_id: uuid::Uuid,
    pub name: String,
    pub progress: f64,
    pub next_milestone: Option<String>,
}

/// Goal
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Goal {
    pub id: uuid::Uuid,
    pub description: String,
    pub priority: u32,
    pub deadline: Option<chrono::DateTime<chrono::Utc>>,
}
