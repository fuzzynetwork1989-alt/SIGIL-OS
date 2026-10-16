use anyhow::Result;
use async_trait::async_trait;
use memory::{MemoryEntry, MemoryType};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

pub mod orchestrator;
pub mod ranking;
pub mod compression;

use orchestrator::RAGOrchestrator;
use ranking::Ranker;
use compression::ContextCompressor;

/// Retrieval source types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RetrievalSource {
    Memory,
    KnowledgeGraph,
    External { url: String },
}

/// Retrieval result with metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrievalResult {
    pub id: Uuid,
    pub content: String,
    pub source: RetrievalSource,
    pub similarity: f32,
    pub confidence: Option<f32>,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub url: Option<String>,
}

/// RAG configuration
#[derive(Debug, Clone)]
pub struct RAGConfig {
    pub max_context_tokens: usize,
    pub confidence_threshold: f32,
    pub max_results: usize,
}

impl Default for RAGConfig {
    fn default() -> Self {
        Self {
            max_context_tokens: 4000,
            confidence_threshold: 0.5,
            max_results: 10,
        }
    }
}

/// RAG system
pub struct RAGSystem {
    config: RAGConfig,
    orchestrator: RAGOrchestrator,
    ranker: Ranker,
    compressor: ContextCompressor,
}

impl RAGSystem {
    /// Create a new RAG system
    pub async fn new(config: RAGConfig) -> Result<Self> {
        let orchestrator = RAGOrchestrator::new().await?;
        let ranker = Ranker::new();
        let compressor = ContextCompressor::new(config.max_context_tokens);
        
        Ok(Self {
            config,
            orchestrator,
            ranker,
            compressor,
        })
    }
    
    /// Query with RAG
    pub async fn query(
        &self,
        query: String,
        sources: Vec<RetrievalSource>,
    ) -> Result<RAGResponse> {
        // Retrieve from multiple sources
        let mut all_results = Vec::new();
        
        for source in sources {
            let results = self.orchestrator.retrieve(&query, source.clone()).await?;
            all_results.extend(results);
        }
        
        // Rank results
        let ranked = self.ranker.rank(all_results);
        
        // Filter by confidence
        let filtered: Vec<_> = ranked
            .into_iter()
            .filter(|r| r.confidence.unwrap_or(0.0) >= self.config.confidence_threshold)
            .take(self.config.max_results)
            .collect();
        
        // Compress context
        let context_texts: Vec<String> = filtered.iter().map(|r| r.content.clone()).collect();
        let compressed_context = self.compressor.compress(&context_texts).await?;
        
        Ok(RAGResponse {
            context: compressed_context,
            sources: filtered,
        })
    }
}

/// RAG response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RAGResponse {
    pub context: String,
    pub sources: Vec<RetrievalResult>,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_rag_config_default() {
        let config = RAGConfig::default();
        assert_eq!(config.max_context_tokens, 4000);
        assert_eq!(config.confidence_threshold, 0.5);
    }
}
