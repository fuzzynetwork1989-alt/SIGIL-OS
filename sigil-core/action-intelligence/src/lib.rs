//! Action Intelligence - Pillar 10 of SCA-1R Cognitive Architecture
//!
//! This module implements action intelligence that converts cognition into behavior.
//! Responsible for action planning, tool use, mission updates, avatar behaviors, and responses.

pub mod planner;
pub mod tool_use;
pub mod mission_update;
pub mod avatar_behavior;

pub use planner::ActionPlanner;
pub use tool_use::ToolUse;
pub use mission_update::MissionUpdate;
pub use avatar_behavior::AvatarBehavior;

use errors::ActionError;

/// Main entry point for action intelligence
pub struct ActionIntelligence {
    planner: ActionPlanner,
    tool_use: ToolUse,
    mission_update: MissionUpdate,
    avatar_behavior: AvatarBehavior,
}

impl ActionIntelligence {
    /// Create a new action intelligence system
    pub fn new() -> Result<Self, ActionError> {
        Ok(Self {
            planner: ActionPlanner::new()?,
            tool_use: ToolUse::new()?,
            mission_update: MissionUpdate::new()?,
            avatar_behavior: AvatarBehavior::new()?,
        })
    }

    /// Plan an action from reasoning
    pub async fn plan_action(&self, reasoning: &str) -> Result<ActionPlan, ActionError> {
        self.planner.plan(reasoning).await
    }

    /// Execute a tool
    pub async fn execute_tool(&self, tool: Tool) -> Result<ToolResult, ActionError> {
        self.tool_use.execute(tool).await
    }

    /// Update mission
    pub async fn update_mission(&self, mission_id: uuid::Uuid, update: MissionUpdateData) -> Result<(), ActionError> {
        self.mission_update.update(mission_id, update).await
    }

    /// Plan avatar behavior
    pub async fn plan_avatar_behavior(&self, context: AvatarContext) -> Result<AvatarBehaviorPlan, ActionError> {
        self.avatar_behavior.plan(context).await
    }
}

/// Action plan
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ActionPlan {
    pub id: uuid::Uuid,
    pub reasoning: String,
    pub actions: Vec<Action>,
    pub estimated_duration: Option<chrono::Duration>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Action
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Action {
    pub id: uuid::Uuid,
    pub action_type: ActionType,
    pub parameters: serde_json::Value,
    pub dependencies: Vec<uuid::Uuid>,
}

/// Action type
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum ActionType {
    ToolUse,
    MissionUpdate,
    AvatarBehavior,
    Response,
    MemoryOperation,
}

/// Tool
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Tool {
    pub name: String,
    pub parameters: serde_json::Value,
}

/// Tool result
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ToolResult {
    pub success: bool,
    pub output: serde_json::Value,
    pub error: Option<String>,
}

/// Mission update data
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct MissionUpdateData {
    pub progress_update: Option<f64>,
    pub milestone_completion: Option<uuid::Uuid>,
    pub risk_addition: Option<String>,
}

/// Avatar context
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct AvatarContext {
    pub current_state: String,
    pub user_position: Option<(f32, f32, f32)>,
    pub room: Option<String>,
    pub task: Option<String>,
}

/// Avatar behavior plan
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct AvatarBehaviorPlan {
    pub behaviors: Vec<AvatarBehavior>,
    pub transitions: Vec<BehaviorTransition>,
}

/// Avatar behavior
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct AvatarBehavior {
    pub behavior_type: String,
    pub parameters: serde_json::Value,
    pub duration: Option<chrono::Duration>,
}

/// Behavior transition
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct BehaviorTransition {
    pub from: String,
    pub to: String,
    pub trigger: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_intelligence_creation() {
        let intelligence = ActionIntelligence::new();
        assert!(intelligence.is_ok());
    }
}
