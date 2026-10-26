//! Mission - represents a cognitive mission

/// Mission - a cognitive mission representing a long-running project
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Mission {
    pub id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub name: String,
    pub description: String,
    pub objectives: Vec<Objective>,
    pub milestones: Vec<super::Milestone>,
    pub dependencies: Vec<super::Dependency>,
    pub risks: Vec<super::Risk>,
    pub progress: f64,
    pub status: MissionStatus,
    pub confidence: f64,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

/// Objective
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Objective {
    pub id: uuid::Uuid,
    pub description: String,
    pub completed: bool,
}

/// Mission status
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum MissionStatus {
    Active,
    Paused,
    Completed,
    Cancelled,
    Failed,
}
