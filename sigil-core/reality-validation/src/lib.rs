//! Reality Validation Intelligence - Eighth Cognitive Pillar
//! Prevents memory pollution through five-stage validation pipeline

use anyhow::Result;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

pub mod validator;
pub mod cross_check;
pub mod scoring;
pub mod storage;

pub use validator::RealityValidator;
pub use cross_check::CrossChecker;
pub use scoring::ConfidenceScorer;
pub use storage::StorageRouter;

/// Knowledge source types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum KnowledgeSource {
    Conversation,
    Voice,
    Document,
    Website,
    QuestVision,
    UserInput,
    AgentOutput,
}

/// Trust level for sources
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TrustLevel {
    Trusted,
    Known,
    Guest,
    Untrusted,
}

/// Validation status
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ValidationStatus {
    Verified,
    LikelyTrue,
    Tentative,
    Unverified,
    Contradicted,
}

/// Storage tier based on confidence
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum StorageTier {
    Permanent,
    Monitored,
    Temporary,
    Cache,
}

/// Validated knowledge record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidatedKnowledge {
    pub id: Uuid,
    pub content: String,
    pub source: SourceInfo,
    pub confidence: f64,
    pub validation_status: ValidationStatus,
    pub cross_check_results: Vec<CrossCheckResult>,
    pub storage_tier: StorageTier,
    pub created_at: DateTime<Utc>,
    pub expires_at: Option<DateTime<Utc>>,
    pub last_validated: DateTime<Utc>,
}

/// Source information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceInfo {
    pub source_type: KnowledgeSource,
    pub trust_level: TrustLevel,
    pub source_id: Option<String>,
    pub metadata: HashMap<String, String>,
}

/// Cross-check result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrossCheckResult {
    pub check_type: String,
    pub matched: bool,
    pub confidence: f64,
    pub details: String,
}

/// Observation input
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Observation {
    pub content: String,
    pub source: SourceInfo,
    pub timestamp: DateTime<Utc>,
}

impl ValidatedKnowledge {
    pub fn new(content: String, source: SourceInfo) -> Self {
        Self {
            id: Uuid::new_v4(),
            content,
            source,
            confidence: 0.0,
            validation_status: ValidationStatus::Unverified,
            cross_check_results: Vec::new(),
            storage_tier: StorageTier::Cache,
            created_at: Utc::now(),
            expires_at: None,
            last_validated: Utc::now(),
        }
    }

    pub fn set_confidence(&mut self, confidence: f64) {
        self.confidence = confidence;
        self.validation_status = Self::status_from_confidence(confidence);
        self.storage_tier = Self::tier_from_confidence(confidence);
    }

    fn status_from_confidence(confidence: f64) -> ValidationStatus {
        match confidence {
            95.0..=100.0 => ValidationStatus::Verified,
            80.0..=94.9 => ValidationStatus::LikelyTrue,
            60.0..=79.9 => ValidationStatus::Tentative,
            _ => ValidationStatus::Unverified,
        }
    }

    fn tier_from_confidence(confidence: f64) -> StorageTier {
        match confidence {
            95.0..=100.0 => StorageTier::Permanent,
            80.0..=94.9 => StorageTier::Monitored,
            60.0..=79.9 => StorageTier::Temporary,
            _ => StorageTier::Cache,
        }
    }
}
