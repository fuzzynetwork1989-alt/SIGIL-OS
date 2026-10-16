use crate::AssembledContext;
use chrono::{DateTime, Utc};
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

/// Context timeline for tracking context history
pub struct ContextTimeline {
    history: Arc<RwLock<Vec<AssembledContext>>>,
}

impl ContextTimeline {
    pub fn new() -> Self {
        Self {
            history: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    pub async fn record_context(&self, context: AssembledContext) -> Result<()> {
        let mut history = self.history.write().await;
        history.push(context);
        Ok(())
    }
    
    pub async fn get_history(&self, limit: usize) -> Result<Vec<AssembledContext>> {
        let history = self.history.read().await;
        let len = history.len();
        let start = if len > limit { len - limit } else { 0 };
        Ok(history[start..].to_vec())
    }
    
    pub async fn clear_old(&self, older_than: DateTime<Utc>) -> Result<()> {
        let mut history = self.history.write().await;
        history.retain(|c| c.created_at > older_than);
        Ok(())
    }
}

impl Default for ContextTimeline {
    fn default() -> Self {
        Self::new()
    }
}
