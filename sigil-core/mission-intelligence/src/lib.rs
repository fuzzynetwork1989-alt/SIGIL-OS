//! Mission Intelligence - Pillar 03 of SCA-1R Cognitive Architecture
//!
//! This module implements mission-native cognition where projects are represented
//! as Cognitive Missions with objectives, milestones, dependencies, risks, progress,
//! and outcomes.
//!
//! # Mission Structure
//!
//! ```
//! Mission
//! ├── Objectives
//! ├── Milestones
//! ├── Dependencies
//! ├── Risks
//! ├── Progress
//! └── Outcomes
//! ```

pub mod mission;
pub mod milestone;
pub mod dependency;
pub mod risk;
pub mod engine;

pub use mission::Mission;
pub use milestone::Milestone;
pub use dependency::Dependency;
pub use risk::Risk;
pub use engine::MissionEngine;

use errors::MissionError;

/// Main entry point for mission intelligence
pub struct MissionIntelligence {
    engine: MissionEngine,
}

impl MissionIntelligence {
    /// Create a new mission intelligence system
    pub fn new() -> Result<Self, MissionError> {
        Ok(Self {
            engine: MissionEngine::new()?,
        })
    }

    /// Create a new mission
    pub async fn create_mission(&self, mission: Mission) -> Result<Mission, MissionError> {
        self.engine.create(mission).await
    }

    /// Update mission progress
    pub async fn update_progress(&self, mission_id: uuid::Uuid, progress: f64) -> Result<(), MissionError> {
        self.engine.update_progress(mission_id, progress).await
    }

    /// Get mission by ID
    pub async fn get_mission(&self, mission_id: uuid::Uuid) -> Result<Mission, MissionError> {
        self.engine.get(mission_id).await
    }

    /// List all missions for a user
    pub async fn list_missions(&self, user_id: uuid::Uuid) -> Result<Vec<Mission>, MissionError> {
        self.engine.list_for_user(user_id).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_intelligence_creation() {
        let intelligence = MissionIntelligence::new();
        assert!(intelligence.is_ok());
    }
}
