//! Persistent Context Router - Assembles context from 7 cognitive layers

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

pub mod layers;
pub mod router;

pub use router::PersistentContextRouter;

/// Unified Cognitive Context
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CognitiveContext {
    pub identity: IdentityLayer,
    pub mission: MissionLayer,
    pub memory: MemoryLayer,
    pub world: WorldLayer,
    pub spatial: SpatialLayer,
    pub tool: ToolLayer,
    pub reflection: ReflectionLayer,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentityLayer {
    pub user_id: Uuid,
    pub display_name: String,
    pub trust_level: String,
    pub preferences: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionLayer {
    pub current_mission: Option<MissionInfo>,
    pub progress: f64,
    pub next_milestone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionInfo {
    pub id: Uuid,
    pub name: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryLayer {
    pub memory_count: usize,
    pub recent_memories: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorldLayer {
    pub active_entities: Vec<String>,
    pub relationships: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialLayer {
    pub current_room: Option<String>,
    pub user_position: Option<[f64; 3]>,
    pub nearby_objects: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolLayer {
    pub available_tools: Vec<String>,
    pub recent_tool_usage: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReflectionLayer {
    pub recent_success_rate: f64,
    pub preferred_style: String,
}
