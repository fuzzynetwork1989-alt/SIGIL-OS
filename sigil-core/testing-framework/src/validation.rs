//! Validation framework

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub test_id: String,
    pub passed: bool,
    pub score: f64,
    pub timestamp: DateTime<Utc>,
    pub details: String,
}

pub struct Validator {
    criteria: Vec<ValidationCriteria>,
}

#[derive(Debug, Clone)]
pub struct ValidationCriteria {
    pub name: String,
    pub weight: f64,
    pub min_score: f64,
}

impl Validator {
    pub fn new() -> Self {
        Self {
            criteria: Vec::new(),
        }
    }

    pub fn add_criteria(&mut self, criteria: ValidationCriteria) {
        self.criteria.push(criteria);
    }

    pub fn validate(&self, test_results: &[f64]) -> ValidationResult {
        let mut total_score = 0.0;
        let mut total_weight = 0.0;

        for (i, criteria) in self.criteria.iter().enumerate() {
            let score = test_results.get(i).copied().unwrap_or(0.0);
            total_score += score * criteria.weight;
            total_weight += criteria.weight;
        }

        let final_score = if total_weight > 0.0 {
            total_score / total_weight
        } else {
            0.0
        };

        let passed = final_score >= 0.8;

        ValidationResult {
            test_id: uuid::Uuid::new_v4().to_string(),
            passed,
            score: final_score,
            timestamp: Utc::now(),
            details: format!("Score: {:.2}", final_score),
        }
    }
}
