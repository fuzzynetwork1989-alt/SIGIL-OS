use crate::AssembledContext;
use anyhow::Result;

/// Context validator
pub struct ContextValidator;

impl ContextValidator {
    pub fn new() -> Self {
        Self
    }
    
    pub async fn validate(&self, context: &AssembledContext) -> Result<bool> {
        // Check token count
        if context.token_count > 4000 {
            return Ok(false);
        }
        
        // Check source diversity
        if context.sources.len() < 1 {
            return Ok(false);
        }
        
        // Check confidence
        if context.confidence < 0.5 {
            return Ok(false);
        }
        
        Ok(true)
    }
}

impl Default for ContextValidator {
    fn default() -> Self {
        Self::new()
    }
}
