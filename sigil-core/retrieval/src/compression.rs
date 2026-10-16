/// Context compressor for RAG context
pub struct ContextCompressor {
    max_tokens: usize,
}

impl ContextCompressor {
    pub fn new(max_tokens: usize) -> Self {
        Self { max_tokens }
    }
    
    /// Compress context to fit within token limit
    pub async fn compress(&self, context: &[String]) -> anyhow::Result<String> {
        let total = self.count_tokens(&context.join("\n"));
        
        if total <= self.max_tokens {
            return Ok(context.join("\n"));
        }
        
        // Simple truncation strategy
        let mut compressed = String::new();
        let mut current_tokens = 0;
        
        for text in context {
            let tokens = self.count_tokens(text);
            if current_tokens + tokens > self.max_tokens {
                break;
            }
            compressed.push_str(text);
            compressed.push('\n');
            current_tokens += tokens;
        }
        
        Ok(compressed)
    }
    
    /// Count tokens (simplified implementation)
    fn count_tokens(&self, text: &str) -> usize {
        // Approximate: 4 characters per token
        text.len() / 4
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn test_compression() {
        let compressor = ContextCompressor::new(100);
        
        let context = vec![
            "Short text".to_string(),
            "Another short text".to_string(),
        ];
        
        let compressed = compressor.compress(&context).await.unwrap();
        assert!(!compressed.is_empty());
    }
}
