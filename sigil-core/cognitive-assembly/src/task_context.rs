//! Task Context - context for a specific task

/// Task Context - context for assembling cognition for a task
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct TaskContext {
    pub task_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub device_id: Option<uuid::Uuid>,
    pub room_id: Option<uuid::Uuid>,
    pub task_type: TaskType,
    pub user_intent: String,
    pub metadata: serde_json::Value,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Task type
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum TaskType {
    Conversation,
    Reasoning,
    Research,
    Coding,
    Teaching,
    Memory,
    Mission,
    Spatial,
    System,
    Custom(String),
}
