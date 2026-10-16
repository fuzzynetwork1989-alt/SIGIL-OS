use crate::{MemoryError, MemorySource, VerificationStatus};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

/// Memory entry with all metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryEntry {
    pub id: Uuid,
    pub memory_type: MemoryType,
    pub content: String,
    pub embedding: Option<Vec<f32>>,
    pub timestamp: DateTime<Utc>,
    pub source: MemorySource,
    pub confidence: f32,
    pub verification_status: VerificationStatus,
    pub sigil: Option<String>, // Cryptographic sigil from sigil system
    pub related_memories: Vec<Uuid>,
    pub tags: Vec<String>,
}

/// Memory type classification
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum MemoryType {
    Working,      // Current context, session-limited
    Episodic,     // Specific events and experiences
    Semantic,     // General knowledge and facts
    LongTerm,     // Archival storage
}

/// Memory operation trait
#[async_trait::async_trait]
pub trait MemoryOperation: Send + Sync {
    async fn store(&self, memory: &MemoryEntry) -> Result<(), MemoryError>;
    async fn retrieve(&self, id: Uuid) -> Result<MemoryEntry, MemoryError>;
    async fn update(&self, memory: &MemoryEntry) -> Result<(), MemoryError>;
    async fn delete(&self, id: Uuid) -> Result<(), MemoryError>;
    async fn search(&self, query: &str, limit: usize) -> Result<Vec<MemoryEntry>, MemoryError>;
}

/// In-memory memory store for testing
pub struct InMemoryStore {
    memories: HashMap<Uuid, MemoryEntry>,
}

impl InMemoryStore {
    pub fn new() -> Self {
        Self {
            memories: HashMap::new(),
        }
    }
}

impl Default for InMemoryStore {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait::async_trait]
impl MemoryOperation for InMemoryStore {
    async fn store(&self, memory: &MemoryEntry) -> Result<(), MemoryError> {
        // This would need interior mutability in production
        Ok(())
    }
    
    async fn retrieve(&self, id: Uuid) -> Result<MemoryEntry, MemoryError> {
        self.memories
            .get(&id)
            .cloned()
            .ok_or_else(|| MemoryError::NotFound(id))
    }
    
    async fn update(&self, memory: &MemoryEntry) -> Result<(), MemoryError> {
        Ok(())
    }
    
    async fn delete(&self, id: Uuid) -> Result<(), MemoryError> {
        Ok(())
    }
    
    async fn search(&self, query: &str, limit: usize) -> Result<Vec<MemoryEntry>, MemoryError> {
        Ok(Vec::new())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_memory_entry_creation() {
        let memory = MemoryEntry {
            id: Uuid::new_v4(),
            memory_type: MemoryType::Episodic,
            content: "Test memory".to_string(),
            embedding: None,
            timestamp: Utc::now(),
            source: MemorySource::ManualEntry {
                user_id: Uuid::new_v4(),
            },
            confidence: 0.9,
            verification_status: VerificationStatus::Unverified,
            sigil: None,
            related_memories: Vec::new(),
            tags: Vec::new(),
        };
        
        assert_eq!(memory.content, "Test memory");
    }
}
