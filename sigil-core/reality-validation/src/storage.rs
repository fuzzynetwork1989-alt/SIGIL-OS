//! Storage Router - Stage 5 of validation pipeline

use crate::{ValidatedKnowledge, StorageTier};
use anyhow::Result;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tracing::{debug, info};
use uuid::Uuid;

pub struct StorageRouter {
    // In a real implementation, this would connect to different storage backends
    permanent_store: Arc<Mutex<HashMap<String, ValidatedKnowledge>>>,
    monitored_store: Arc<Mutex<HashMap<String, ValidatedKnowledge>>>,
    temporary_store: Arc<Mutex<HashMap<String, ValidatedKnowledge>>>,
    cache_store: Arc<Mutex<HashMap<String, ValidatedKnowledge>>>,
}

impl StorageRouter {
    pub fn new() -> Self {
        Self {
            permanent_store: Arc::new(Mutex::new(HashMap::new())),
            monitored_store: Arc::new(Mutex::new(HashMap::new())),
            temporary_store: Arc::new(Mutex::new(HashMap::new())),
            cache_store: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    /// Stage 5: Route knowledge to appropriate storage tier
    pub async fn route_to_storage(&self, knowledge: ValidatedKnowledge) -> Result<Uuid> {
        let id = knowledge.id;
        let key = id.to_string();

        match knowledge.storage_tier {
            StorageTier::Permanent => {
                info!("Routing to permanent storage: {}", id);
                let mut store = self.permanent_store.lock().unwrap();
                store.insert(key, knowledge);
            }
            StorageTier::Monitored => {
                info!("Routing to monitored storage: {}", id);
                let mut store = self.monitored_store.lock().unwrap();
                store.insert(key, knowledge);
            }
            StorageTier::Temporary => {
                debug!("Routing to temporary storage: {}", id);
                let mut store = self.temporary_store.lock().unwrap();
                store.insert(key, knowledge);
            }
            StorageTier::Cache => {
                debug!("Routing to cache: {}", id);
                let mut store = self.cache_store.lock().unwrap();
                store.insert(key, knowledge);
            }
        }

        Ok(id)
    }

    pub async fn retrieve(&self, id: Uuid) -> Option<ValidatedKnowledge> {
        let key = id.to_string();

        // Check all stores in priority order
        let stores = vec![
            &self.permanent_store,
            &self.monitored_store,
            &self.temporary_store,
            &self.cache_store,
        ];

        for store in stores {
            let store = store.lock().unwrap();
            if let Some(knowledge) = store.get(&key) {
                return Some(knowledge.clone());
            }
        }

        None
    }

    pub async fn get_storage_stats(&self) -> StorageStats {
        StorageStats {
            permanent_count: self.permanent_store.lock().unwrap().len(),
            monitored_count: self.monitored_store.lock().unwrap().len(),
            temporary_count: self.temporary_store.lock().unwrap().len(),
            cache_count: self.cache_store.lock().unwrap().len(),
        }
    }
}

#[derive(Debug)]
pub struct StorageStats {
    pub permanent_count: usize,
    pub monitored_count: usize,
    pub temporary_count: usize,
    pub cache_count: usize,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{SourceInfo, StorageTier, TrustLevel, ValidationStatus};

    #[tokio::test]
    async fn test_route_to_permanent() {
        let router = StorageRouter::new();
        let mut knowledge = ValidatedKnowledge::new(
            "Test".to_string(),
            SourceInfo {
                source_type: crate::KnowledgeSource::UserInput,
                trust_level: TrustLevel::Trusted,
                source_id: None,
                metadata: Default::default(),
            },
        );
        knowledge.set_confidence(95.0);

        let id = router.route_to_storage(knowledge).await.unwrap();
        let retrieved = router.retrieve(id).await.unwrap();

        assert_eq!(retrieved.storage_tier, StorageTier::Permanent);
    }

    #[tokio::test]
    async fn test_route_to_monitored() {
        let router = StorageRouter::new();
        let mut knowledge = ValidatedKnowledge::new(
            "Test".to_string(),
            SourceInfo {
                source_type: crate::KnowledgeSource::UserInput,
                trust_level: TrustLevel::Trusted,
                source_id: None,
                metadata: Default::default(),
            },
        );
        knowledge.set_confidence(85.0);

        let id = router.route_to_storage(knowledge).await.unwrap();
        let retrieved = router.retrieve(id).await.unwrap();

        assert_eq!(retrieved.storage_tier, StorageTier::Monitored);
    }

    #[tokio::test]
    async fn test_retrieve_missing() {
        let router = StorageRouter::new();
        let retrieved = router.retrieve(Uuid::new_v4()).await;
        assert!(retrieved.is_none());
    }

    #[tokio::test]
    async fn test_storage_stats() {
        let router = StorageRouter::new();
        let stats = router.get_storage_stats().await;
        assert_eq!(stats.permanent_count, 0);
        assert_eq!(stats.monitored_count, 0);
    }
}
