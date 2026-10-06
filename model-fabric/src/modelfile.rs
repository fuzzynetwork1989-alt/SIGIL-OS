//! Modelfile format and parser
//!
//! Modelfile is a configuration format for defining how to run models,
//! inspired by Ollama's Modelfile format.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::ModelFabricError;

/// Modelfile structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Modelfile {
    /// Model name (e.g., "qwen:7b")
    pub model: String,

    /// Model family (e.g., "qwen")
    #[serde(default)]
    pub family: Option<String>,

    /// Model parameters
    #[serde(default)]
    pub parameters: ModelParameters,

    /// Template for prompts
    #[serde(default)]
    pub template: Option<String>,

    /// System prompt
    #[serde(default)]
    pub system: Option<String>,

    /// Additional metadata
    #[serde(default)]
    pub metadata: HashMap<String, String>,
}

/// Model parameters for inference
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelParameters {
    /// Temperature (0.0 - 2.0)
    #[serde(default = "default_temperature")]
    pub temperature: f32,

    /// Top-p sampling (0.0 - 1.0)
    #[serde(default = "default_top_p")]
    pub top_p: f32,

    /// Top-k sampling
    #[serde(default)]
    pub top_k: Option<u32>,

    /// Maximum tokens to generate
    #[serde(default = "default_max_tokens")]
    pub max_tokens: u32,

    /// Number of candidates
    #[serde(default)]
    pub num_return_sequences: Option<u32>,

    /// Repeat penalty
    #[serde(default)]
    pub repeat_penalty: Option<f32>,

    /// Presence penalty
    #[serde(default)]
    pub presence_penalty: Option<f32>,
}

impl Default for ModelParameters {
    fn default() -> Self {
        Self {
            temperature: default_temperature(),
            top_p: default_top_p(),
            top_k: None,
            max_tokens: default_max_tokens(),
            num_return_sequences: None,
            repeat_penalty: None,
            presence_penalty: None,
        }
    }
}

fn default_temperature() -> f32 {
    0.7
}

fn default_top_p() -> f32 {
    0.9
}

fn default_max_tokens() -> u32 {
    512
}

/// Modelfile parser
pub struct ModelfileParser;

impl ModelfileParser {
    /// Parse a Modelfile from a string
    pub fn parse_str(content: &str) -> std::result::Result<Modelfile, ModelFabricError> {
        // Simple parser: try TOML first, then YAML
        if let Ok(modelfile) = Self::parse_toml(content) {
            return Ok(modelfile);
        }
        if let Ok(modelfile) = Self::parse_yaml(content) {
            return Ok(modelfile);
        }
        Err(ModelFabricError::InvalidModelfile(
            "Could not parse as TOML or YAML".to_string(),
        ))
    }

    /// Parse a Modelfile from a file
    pub fn parse_file(path: &str) -> std::result::Result<Modelfile, ModelFabricError> {
        let content = std::fs::read_to_string(path)?;
        Self::parse_str(&content)
    }

    /// Parse as TOML
    fn parse_toml(content: &str) -> std::result::Result<Modelfile, ModelFabricError> {
        toml::from_str(content).map_err(|e| ModelFabricError::InvalidModelfile(e.to_string()))
    }

    /// Parse as YAML
    fn parse_yaml(content: &str) -> std::result::Result<Modelfile, ModelFabricError> {
        serde_yaml::from_str(content).map_err(|e| ModelFabricError::InvalidModelfile(e.to_string()))
    }

    /// Serialize a Modelfile to TOML
    pub fn to_toml(modelfile: &Modelfile) -> std::result::Result<String, ModelFabricError> {
        toml::to_string_pretty(modelfile)
            .map_err(|e| ModelFabricError::Serialization(e.to_string()))
    }

    /// Serialize a Modelfile to YAML
    pub fn to_yaml(modelfile: &Modelfile) -> std::result::Result<String, ModelFabricError> {
        serde_yaml::to_string(modelfile).map_err(|e| ModelFabricError::Serialization(e.to_string()))
    }
}

impl Default for Modelfile {
    fn default() -> Self {
        Self {
            model: String::new(),
            family: None,
            parameters: ModelParameters::default(),
            template: None,
            system: None,
            metadata: HashMap::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_modelfile() {
        let content = r#"
model = "qwen:7b"
family = "qwen"

[parameters]
temperature = 0.8
max_tokens = 1024
"#;
        let modelfile = ModelfileParser::parse_str(content).unwrap();
        assert_eq!(modelfile.model, "qwen:7b");
        assert_eq!(modelfile.family, Some("qwen".to_string()));
        assert_eq!(modelfile.parameters.temperature, 0.8);
        assert_eq!(modelfile.parameters.max_tokens, 1024);
    }

    #[test]
    fn test_parse_with_defaults() {
        let content = r#"
model = "qwen:7b"
"#;
        let modelfile = ModelfileParser::parse_str(content).unwrap();
        assert_eq!(modelfile.model, "qwen:7b");
        assert_eq!(modelfile.parameters.temperature, 0.7); // default
        assert_eq!(modelfile.parameters.max_tokens, 512); // default
    }

    #[test]
    fn test_serialize_to_toml() {
        let modelfile = Modelfile {
            model: "qwen:7b".to_string(),
            family: Some("qwen".to_string()),
            parameters: ModelParameters {
                temperature: 0.8,
                top_p: 0.9,
                top_k: Some(40),
                max_tokens: 1024,
                num_return_sequences: None,
                repeat_penalty: None,
                presence_penalty: None,
            },
            template: Some("Hello {{.Prompt}}".to_string()),
            system: Some("You are a helpful assistant.".to_string()),
            metadata: HashMap::new(),
        };

        let toml = ModelfileParser::to_toml(&modelfile).unwrap();
        assert!(toml.contains("model = \"qwen:7b\""));
        assert!(toml.contains("family = \"qwen\""));
    }
}
