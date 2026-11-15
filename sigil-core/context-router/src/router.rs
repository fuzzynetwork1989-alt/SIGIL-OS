//! Persistent Context Router - Main orchestrator

use crate::CognitiveContext;
use crate::layers::LayerAssembler;
use anyhow::Result;
use tracing::{debug, info};
use uuid::Uuid;

pub struct PersistentContextRouter {
    assembler: LayerAssembler,
}

impl PersistentContextRouter {
    pub fn new() -> Self {
        Self {
            assembler: LayerAssembler,
        }
    }

    /// Assemble unified cognitive context from all 7 layers
    pub async fn assemble_context(&self, prompt: &str, user_id: Uuid) -> Result<CognitiveContext> {
        info!("Assembling context for prompt: {}", prompt);

        let identity = LayerAssembler::assemble_identity_layer(user_id).await?;
        let mission = LayerAssembler::assemble_mission_layer(user_id).await?;
        let memory = LayerAssembler::assemble_memory_layer(user_id).await?;
        let world = LayerAssembler::assemble_world_layer(user_id).await?;
        let spatial = LayerAssembler::assemble_spatial_layer(user_id).await?;
        let tool = LayerAssembler::assemble_tool_layer(user_id).await?;
        let reflection = LayerAssembler::assemble_reflection_layer(user_id).await?;

        debug!("Context assembly complete");

        Ok(CognitiveContext {
            identity,
            mission,
            memory,
            world,
            spatial,
            tool,
            reflection,
        })
    }
}

impl Default for PersistentContextRouter {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_context_assembly() {
        let router = PersistentContextRouter::new();
        let user_id = Uuid::new_v4();
        let context = router.assemble_context("Test prompt", user_id).await.unwrap();

        assert_eq!(context.identity.display_name, "Corey");
        assert_eq!(context.mission.progress, 0.42);
        assert_eq!(context.memory.memory_count, 14);
    }
}
