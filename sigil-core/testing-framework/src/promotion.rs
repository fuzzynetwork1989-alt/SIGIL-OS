//! Promotion pipeline for staging and release

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PromotionStage {
    Development,
    Testing,
    Staging,
    Production,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PromotionPipeline {
    pub current_stage: PromotionStage,
    pub promotion_history: Vec<PromotionEvent>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PromotionEvent {
    pub from_stage: PromotionStage,
    pub to_stage: PromotionStage,
    pub timestamp: DateTime<Utc>,
    pub approved_by: String,
}

impl PromotionPipeline {
    pub fn new() -> Self {
        Self {
            current_stage: PromotionStage::Development,
            promotion_history: Vec::new(),
        }
    }

    pub fn promote(&mut self, to_stage: PromotionStage, approved_by: String) -> Result<(), String> {
        if !self.can_promote_to(&to_stage) {
            return Err(format!(
                "Cannot promote from {:?} to {:?}",
                self.current_stage, to_stage
            ));
        }

        let event = PromotionEvent {
            from_stage: self.current_stage.clone(),
            to_stage: to_stage.clone(),
            timestamp: Utc::now(),
            approved_by,
        };

        self.promotion_history.push(event);
        self.current_stage = to_stage;

        Ok(())
    }

    pub fn can_promote_to(&self, to_stage: &PromotionStage) -> bool {
        match (&self.current_stage, to_stage) {
            (PromotionStage::Development, PromotionStage::Testing) => true,
            (PromotionStage::Testing, PromotionStage::Staging) => true,
            (PromotionStage::Staging, PromotionStage::Production) => true,
            _ => false,
        }
    }
}
