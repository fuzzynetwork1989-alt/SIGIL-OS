//! Dependency - represents a mission dependency

/// Dependency - a dependency between missions or tasks
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Dependency {
    pub id: uuid::Uuid,
    pub mission_id: uuid::Uuid,
    pub depends_on: uuid::Uuid,
    pub dependency_type: DependencyType,
    pub description: String,
}

/// Dependency type
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum DependencyType {
    Blocks,
    Requires,
    Suggested,
}
