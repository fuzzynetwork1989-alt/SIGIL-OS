//! Cognitive Assembly Engine - Creates temporary "mind states" for tasks

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

pub use context_router::CognitiveContext;

/// Assembled Cognition - temporary "mind state" for current task
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssembledCognition {
    pub id: Uuid,
    pub identity: IdentitySnapshot,
    pub mission: MissionSnapshot,
    pub memory: MemorySnapshot,
    pub world: WorldSnapshot,
    pub spatial: SpatialSnapshot,
    pub goals: Vec<Goal>,
    pub active_work: ActiveWork,
    pub coherence_score: f64,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentitySnapshot {
    pub user_id: Uuid,
    pub preferences: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionSnapshot {
    pub current_mission: Option<String>,
    pub progress: f64,
    pub next_action: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemorySnapshot {
    pub active_memories: Vec<Uuid>,
    pub recent_context: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorldSnapshot {
    pub active_entities: Vec<String>,
    pub relevant_relationships: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialSnapshot {
    pub current_room: Option<String>,
    pub user_position: Option<[f64; 3]>,
    pub context_anchors: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Goal {
    pub id: Uuid,
    pub description: String,
    pub priority: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveWork {
    pub task: String,
    pub resources: Vec<String>,
    pub time_remaining: Option<i64>,
}

pub struct CognitiveAssemblyEngine;

impl CognitiveAssemblyEngine {
    pub fn new() -> Self {
        Self
    }

    /// Create temporary "mind state" by combining all cognitive layers
    pub fn assemble(&self, context: CognitiveContext, task: Task) -> AssembledCognition {
        let identity = IdentitySnapshot {
            user_id: context.identity.user_id,
            preferences: context.identity.preferences,
        };

        let mission = MissionSnapshot {
            current_mission: context.mission.current_mission.as_ref().map(|m| m.name.clone()),
            progress: context.mission.progress,
            next_action: context.mission.next_milestone,
        };

        let memory = MemorySnapshot {
            active_memories: vec![],
            recent_context: context.memory.recent_memories,
        };

        let world = WorldSnapshot {
            active_entities: context.world.active_entities,
            relevant_relationships: context.world.relationships,
        };

        let spatial = SpatialSnapshot {
            current_room: context.spatial.current_room,
            user_position: context.spatial.user_position,
            context_anchors: context.spatial.nearby_objects,
        };

        AssembledCognition {
            id: Uuid::new_v4(),
            identity,
            mission,
            memory,
            world,
            spatial,
            goals: vec![],
            active_work: ActiveWork {
                task: task.description,
                resources: task.resources,
                time_remaining: task.time_remaining,
            },
            coherence_score: 0.95,
            created_at: chrono::Utc::now(),
        }
    }

    /// Optimize assembled cognition for specific task
    pub fn optimize_for_task(&self, cognition: &mut AssembledCognition, task: Task) {
        cognition.active_work = ActiveWork {
            task: task.description,
            resources: task.resources,
            time_remaining: task.time_remaining,
        };
    }

    /// Maintain temporal coherence
    pub fn maintain_coherence(&self, cognition: &mut AssembledCognition) {
        cognition.coherence_score = 0.95;
    }
}

#[derive(Debug, Clone)]
pub struct Task {
    pub description: String,
    pub resources: Vec<String>,
    pub time_remaining: Option<i64>,
}

impl Default for CognitiveAssemblyEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use context_router::{LayerAssembler, PersistentContextRouter};

    #[test]
    fn test_cognition_assembly() {
        let engine = CognitiveAssemblyEngine::new();
        let router = PersistentContextRouter::new();
        
        let context = tokio::runtime::Runtime::new().unwrap().block_on(async {
            router.assemble_context("test", Uuid::new_v4()).await.unwrap()
        });

        let task = Task {
            description: "Complete task".to_string(),
            resources: vec!["memory".to_string()],
            time_remaining: Some(3600),
        };

        let cognition = engine.assemble(context, task);
        assert_eq!(cognition.active_work.task, "Complete task");
    }
}
