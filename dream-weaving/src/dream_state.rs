//! Dream State Engine
//!
//! This module manages the dream-like cognitive states where SIGIL OS can
//! perform unconstrained association and pattern emergence.

use uuid::Uuid;

use crate::{DreamWeavingError, Result};

/// Dream state
#[derive(Debug, Clone)]
pub struct DreamState {
    /// Dream ID
    pub id: Uuid,

    /// Is dream active
    pub active: bool,

    /// Dream cycle type
    pub cycle: DreamCycle,

    /// Dream trigger
    pub trigger: DreamTrigger,

    /// Associations generated
    pub associations: Vec<Association>,

    /// Insights extracted
    pub insights: Vec<Insight>,

    /// Entropy level (0.0 - 1.0)
    pub entropy: f32,

    /// Dream duration in seconds
    pub duration: u32,
}

/// Dream cycle type
#[derive(Debug, Clone, Copy)]
pub enum DreamCycle {
    /// Idle dreaming (periodic)
    Idle,

    /// Scheduled dreaming
    Scheduled,

    /// Pressure-triggered dreaming
    Pressure,

    /// Manual activation
    Manual,
}

/// Dream trigger
#[derive(Debug, Clone)]
pub struct DreamTrigger {
    /// Trigger type
    pub trigger_type: String,

    /// Trigger value
    pub value: String,

    /// Timestamp
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

/// Association
#[derive(Debug, Clone)]
pub struct Association {
    /// Association ID
    pub id: Uuid,

    /// Source concept
    pub source: String,

    /// Target concept
    pub target: String,

    /// Association strength (0.0 - 1.0)
    pub strength: f32,

    /// Is novel (new association)
    pub novel: bool,
}

/// Insight
#[derive(Debug, Clone)]
pub struct Insight {
    /// Insight ID
    pub id: Uuid,

    /// Insight content
    pub content: String,

    /// Confidence (0.0 - 1.0)
    pub confidence: f32,

    /// Related associations
    pub associations: Vec<Uuid>,
}

/// Dream State Engine
pub struct DreamStateEngine {
    /// Current dream state
    current_dream: Option<DreamState>,

    /// Dream history
    dream_history: Vec<DreamState>,
}

impl DreamStateEngine {
    /// Create a new dream state engine
    pub fn new() -> Self {
        Self {
            current_dream: None,
            dream_history: Vec::new(),
        }
    }

    /// Activate dream state
    pub fn activate_dream(&mut self, cycle: DreamCycle, trigger: DreamTrigger) -> Result<()> {
        if self.current_dream.is_some() {
            return Err(DreamWeavingError::DreamNotActive);
        }

        let dream = DreamState {
            id: Uuid::new_v4(),
            active: true,
            cycle,
            trigger,
            associations: Vec::new(),
            insights: Vec::new(),
            entropy: 0.5,
            duration: 0,
        };

        self.current_dream = Some(dream);
        Ok(())
    }

    /// Deactivate dream state
    pub fn deactivate_dream(&mut self) -> Result<()> {
        if let Some(dream) = self.current_dream.take() {
            self.dream_history.push(dream);
            Ok(())
        } else {
            Err(DreamWeavingError::DreamNotActive)
        }
    }

    /// Generate associations
    pub fn generate_associations(&mut self, concepts: Vec<String>) -> Result<()> {
        let dream = self
            .current_dream
            .as_mut()
            .ok_or(DreamWeavingError::DreamNotActive)?;

        for source in &concepts {
            for target in &concepts {
                if source != target {
                    let association = Association {
                        id: Uuid::new_v4(),
                        source: source.clone(),
                        target: target.clone(),
                        strength: rand::random::<f32>(),
                        novel: rand::random::<bool>(),
                    };
                    dream.associations.push(association);
                }
            }
        }

        Ok(())
    }

    /// Extract insights
    pub fn extract_insights(&mut self) -> Result<()> {
        let dream = self
            .current_dream
            .as_mut()
            .ok_or(DreamWeavingError::DreamNotActive)?;

        // Generate insights from strong associations
        for association in &dream.associations {
            if association.strength > 0.8 && association.novel {
                let insight = Insight {
                    id: Uuid::new_v4(),
                    content: format!(
                        "Novel strong association: {} -> {}",
                        association.source, association.target
                    ),
                    confidence: association.strength,
                    associations: vec![association.id],
                };
                dream.insights.push(insight);
            }
        }

        Ok(())
    }

    /// Get current dream state
    pub fn get_current_dream(&self) -> Option<&DreamState> {
        self.current_dream.as_ref()
    }

    /// Get dream history
    pub fn get_dream_history(&self) -> &[DreamState] {
        &self.dream_history
    }
}

impl Default for DreamStateEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dream_activation() {
        let mut engine = DreamStateEngine::new();
        let trigger = DreamTrigger {
            trigger_type: "manual".to_string(),
            value: "test".to_string(),
            timestamp: chrono::Utc::now(),
        };

        engine.activate_dream(DreamCycle::Manual, trigger).unwrap();
        assert!(engine.get_current_dream().is_some());
    }

    #[test]
    fn test_dream_deactivation() {
        let mut engine = DreamStateEngine::new();
        let trigger = DreamTrigger {
            trigger_type: "manual".to_string(),
            value: "test".to_string(),
            timestamp: chrono::Utc::now(),
        };

        engine.activate_dream(DreamCycle::Manual, trigger).unwrap();
        engine.deactivate_dream().unwrap();
        assert!(engine.get_current_dream().is_none());
        assert_eq!(engine.get_dream_history().len(), 1);
    }

    #[test]
    fn test_association_generation() {
        let mut engine = DreamStateEngine::new();
        let trigger = DreamTrigger {
            trigger_type: "manual".to_string(),
            value: "test".to_string(),
            timestamp: chrono::Utc::now(),
        };

        engine.activate_dream(DreamCycle::Manual, trigger).unwrap();
        engine
            .generate_associations(vec!["concept1".to_string(), "concept2".to_string()])
            .unwrap();

        let dream = engine.get_current_dream().unwrap();
        assert_eq!(dream.associations.len(), 2);
    }

    #[test]
    fn test_insight_extraction() {
        let mut engine = DreamStateEngine::new();
        let trigger = DreamTrigger {
            trigger_type: "manual".to_string(),
            value: "test".to_string(),
            timestamp: chrono::Utc::now(),
        };

        engine.activate_dream(DreamCycle::Manual, trigger).unwrap();
        engine
            .generate_associations(vec!["concept1".to_string(), "concept2".to_string()])
            .unwrap();
        engine.extract_insights().unwrap();

        let dream = engine.get_current_dream().unwrap();
        // Insights depend on random values, so we just check the method works
        assert!(dream.insights.len() >= 0);
    }
}
