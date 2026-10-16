use crate::RetrievalResult;
use chrono::{DateTime, Utc};

/// Ranking system for retrieval results
pub struct Ranker;

impl Ranker {
    pub fn new() -> Self {
        Self
    }
    
    /// Rank results by multiple factors
    pub fn rank(&self, mut results: Vec<RetrievalResult>) -> Vec<RetrievalResult> {
        results.sort_by(|a, b| {
            let score_a = self.calculate_ranking_score(a);
            let score_b = self.calculate_ranking_score(b);
            score_b.partial_cmp(&score_a).unwrap()
        });
        
        results
    }
    
    /// Calculate ranking score
    fn calculate_ranking_score(&self, result: &RetrievalResult) -> f32 {
        let similarity = result.similarity;
        let source_reliability = self.source_reliability(&result.source);
        let confidence = result.confidence.unwrap_or(0.5);
        let freshness = self.calculate_freshness(&result.timestamp);
        
        (similarity * 0.4) + (source_reliability * 0.2) + (confidence * 0.2) + (freshness * 0.2)
    }
    
    /// Source reliability score
    fn source_reliability(&self, source: &crate::RetrievalSource) -> f32 {
        match source {
            crate::RetrievalSource::Memory => 0.9,
            crate::RetrievalSource::KnowledgeGraph => 0.85,
            crate::RetrievalSource::External { .. } => 0.6,
        }
    }
    
    /// Calculate freshness score
    fn calculate_freshness(&self, timestamp: &DateTime<Utc>) -> f32 {
        let now = Utc::now();
        let duration = now.signed_duration_since(*timestamp);
        let hours = duration.num_hours();
        
        match hours {
            0..=1 => 1.0,
            1..=24 => 0.9,
            24..=168 => 0.8,
            168..=720 => 0.7,
            _ => 0.6,
        }
    }
}

impl Default for Ranker {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;
    
    #[test]
    fn test_ranking() {
        let ranker = Ranker::new();
        
        let mut results = vec![
            RetrievalResult {
                id: uuid::Uuid::new_v4(),
                content: "Test".to_string(),
                source: crate::RetrievalSource::Memory,
                similarity: 0.7,
                confidence: Some(0.8),
                timestamp: Utc::now(),
                url: None,
            },
            RetrievalResult {
                id: uuid::Uuid::new_v4(),
                content: "Test 2".to_string(),
                source: crate::RetrievalSource::External {
                    url: "http://example.com".to_string(),
                },
                similarity: 0.9,
                confidence: Some(0.6),
                timestamp: Utc::now(),
                url: Some("http://example.com".to_string()),
            },
        ];
        
        let ranked = ranker.rank(results);
        
        // Memory should rank higher due to source reliability
        assert_eq!(ranked[0].source, crate::RetrievalSource::Memory);
    }
}
