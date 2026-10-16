use crate::{AssembledContext, RetrievalResult};
use anyhow::Result;
use uuid::Uuid;

/// Context assembler
pub struct ContextAssembler {
    max_tokens: usize,
}

impl ContextAssembler {
    pub fn new() -> Result<Self> {
        Ok(Self {
            max_tokens: 4000,
        })
    }
    
    pub async fn assemble(&self, query: String, results: Vec<RetrievalResult>) -> Result<AssembledContext> {
        let content = self.build_content(&results);
        let sources: Vec<Uuid> = results.iter().map(|r| r.id).collect();
        let token_count = self.count_tokens(&content);
        
        Ok(AssembledContext {
            id: uuid::Uuid::new_v4(),
            query,
            content,
            sources,
            created_at: chrono::Utc::now(),
            token_count,
            confidence: 0.8,
        })
    }
    
    fn build_content(&self, results: &[RetrievalResult]) -> String {
        let mut content = String::new();
        
        for result in results {
            content.push_str(&result.content);
            content.push_str("\n\n");
        }
        
        content
    }
    
    fn count_tokens(&self, text: &str) -> usize {
        text.len() / 4 // Approximate
    }
}

impl Default for ContextAssembler {
    fn default() -> Self {
        Self::new().unwrap()
    }
}
