//! Base model selection and loading
//!
//! This module handles the selection and loading of base models,
//! with a focus on Qwen 7B as the primary model.

use std::path::PathBuf;
use uuid::Uuid;

use crate::ModelFabricError;

/// Base model information
#[derive(Debug, Clone)]
pub struct BaseModel {
    /// Unique model identifier
    pub id: Uuid,

    /// Model name (e.g., "qwen:7b")
    pub name: String,

    /// Model family (e.g., "qwen")
    pub family: String,

    /// Model version
    pub version: String,

    /// Model size in parameters
    pub parameters: u64,

    /// Model capabilities
    pub capabilities: ModelCapabilities,

    /// Model path (weights location)
    pub path: PathBuf,

    /// Whether model is loaded
    pub loaded: bool,
}

/// Model capabilities
#[derive(Debug, Clone)]
pub struct ModelCapabilities {
    /// Text generation
    pub text: bool,

    /// Vision/multimodal
    pub vision: bool,

    /// Code generation
    pub code: bool,

    /// Tool use
    pub tools: bool,
}

impl Default for ModelCapabilities {
    fn default() -> Self {
        Self {
            text: true,
            vision: false,
            code: false,
            tools: false,
        }
    }
}

/// Model selector for choosing and loading models
pub struct ModelSelector {
    /// Available models
    models: Vec<BaseModel>,

    /// Currently selected model
    selected: Option<Uuid>,
}

impl ModelSelector {
    /// Create a new model selector
    pub fn new() -> Self {
        Self {
            models: Vec::new(),
            selected: None,
        }
    }

    /// Register a model
    pub fn register_model(&mut self, model: BaseModel) {
        self.models.push(model);
    }

    /// Select a model by name
    pub fn select_model(&mut self, name: &str) -> std::result::Result<&BaseModel, ModelFabricError> {
        let model = self
            .models
            .iter()
            .find(|m| m.name == name)
            .ok_or_else(|| ModelFabricError::ModelNotFound(name.to_string()))?;

        self.selected = Some(model.id);
        Ok(model)
    }

    /// Get the currently selected model
    pub fn get_selected(&self) -> Option<&BaseModel> {
        self.selected.and_then(|id| self.models.iter().find(|m| m.id == id))
    }

    /// Get model by name
    pub fn get_model(&self, name: &str) -> Option<&BaseModel> {
        self.models.iter().find(|m| m.name == name)
    }

    /// List all available models
    pub fn list_models(&self) -> Vec<&BaseModel> {
        self.models.iter().collect()
    }
}

impl Default for ModelSelector {
    fn default() -> Self {
        Self::new()
    }
}

/// Qwen 7B base model configuration
pub fn qwen_7b_config() -> BaseModel {
    BaseModel {
        id: Uuid::new_v4(),
        name: "qwen:7b".to_string(),
        family: "qwen".to_string(),
        version: "1.0".to_string(),
        parameters: 7_000_000_000,
        capabilities: ModelCapabilities {
            text: true,
            vision: false,
            code: true,
            tools: false,
        },
        path: PathBuf::from("models/qwen-7b"),
        loaded: false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_model_selector_creation() {
        let selector = ModelSelector::new();
        assert_eq!(selector.models.len(), 0);
    }

    #[test]
    fn test_register_model() {
        let mut selector = ModelSelector::new();
        let model = qwen_7b_config();
        selector.register_model(model.clone());
        assert_eq!(selector.models.len(), 1);
    }

    #[test]
    fn test_select_model() {
        let mut selector = ModelSelector::new();
        let model = qwen_7b_config();
        selector.register_model(model.clone());

        let selected = selector.select_model("qwen:7b").unwrap();
        assert_eq!(selected.name, "qwen:7b");
    }

    #[test]
    fn test_select_nonexistent_model() {
        let mut selector = ModelSelector::new();
        let result = selector.select_model("nonexistent");
        assert!(result.is_err());
    }

    #[test]
    fn test_get_selected() {
        let mut selector = ModelSelector::new();
        let model = qwen_7b_config();
        selector.register_model(model.clone());
        selector.select_model("qwen:7b").unwrap();

        let selected = selector.get_selected().unwrap();
        assert_eq!(selected.name, "qwen:7b");
    }
}
