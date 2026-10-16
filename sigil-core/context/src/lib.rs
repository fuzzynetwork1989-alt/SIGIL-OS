use anyhow::Result;
use async_trait::async_trait;
use memory::MemoryEntry;
use retrieval::RetrievalResult;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

pub mod assembly;
pub mod validation;
pub mod timeline;

use assembly::ContextAssembler;
use validation::ContextValidator;
use timeline::ContextTimeline;

/// Context management system
pub struct ContextManager {
    assembler: Arc<ContextAssembler>,
    validator: Arc<ContextValidator>,
    timeline: Arc<ContextTimeline>,
}

impl ContextManager {
    /// Create a new context manager
    pub async fn new() -> Result<Self> {
        let assembler = Arc::new(ContextAssembler::new().await?);
        let validator = Arc::new(ContextValidator::new());
        let timeline = Arc::new(ContextTimeline::new());
        
        Ok(Self {
            assembler,
            validator,
            timeline,
        })
    }
    
    /// Assemble context from retrieval results
    pub async fn assemble_context(
        &self,
        query: String,
        results: Vec<RetrievalResult>,
    ) -> Result<AssembledContext> {
        let context = self.assembler.assemble(query, results).await?;
        
        // Validate the assembled context
        self.validator.validate(&context).await?;
        
        // Add to timeline
        self.timeline.record_context(context.clone()).await;
        
        Ok(context)
    }
    
    /// Get context history
    pub async fn get_history(&self, limit: usize) -> Result<Vec<AssembledContext>> {
        self.timeline.get_history(limit).await
    }
}

/// Assembled context with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssembledContext {
    pub id: Uuid,
    pub query: String,
    pub content: String,
    pub sources: Vec<Uuid>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub token_count: usize,
    pub confidence: f32,
}

/// Context operation trait
#[async_trait::async_trait]
pub trait ContextOperation: Send + Sync {
    async fn assemble(&self, query: String, results: Vec<RetrievalResult>) -> Result<AssembledContext>;
    async fn validate(&self, context: &AssembledContext) -> Result<bool>;
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_context_manager() {
        let manager = ContextManager::new().await.unwrap();
        assert!(true);
    }
}
