//! Milestone - represents a mission milestone

/// Milestone - a significant point in a mission
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Milestone {
    pub id: uuid::Uuid,
    pub mission_id: uuid::Uuid,
    pub name: String,
    pub description: String,
    pub due_date: Option<chrono::DateTime<chrono::Utc>>,
    pub completed: bool,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
}
