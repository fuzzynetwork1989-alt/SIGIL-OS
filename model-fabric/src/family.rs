//! Model family management
//!
//! This module handles model families (e.g., Qwen, LLaMA, Mistral)
//! and their versions.

use std::collections::HashMap;

/// Model family information
#[derive(Debug, Clone)]
pub struct ModelFamily {
    /// Family name (e.g., "qwen")
    pub name: String,

    /// Family description
    pub description: String,

    /// Available versions
    pub versions: Vec<ModelVersion>,

    /// Default version
    pub default_version: String,
}

/// Model version information
#[derive(Debug, Clone)]
pub struct ModelVersion {
    /// Version identifier (e.g., "7b", "14b")
    pub id: String,

    /// Full version string (e.g., "1.0.0")
    pub version: String,

    /// Parameter count
    pub parameters: u64,

    /// Model weights path
    pub path: String,

    /// Quantization (e.g., "fp16", "int8")
    pub quantization: String,
}

/// Model family registry
pub struct ModelFamilyRegistry {
    families: HashMap<String, ModelFamily>,
}

impl ModelFamilyRegistry {
    /// Create a new registry
    pub fn new() -> Self {
        Self {
            families: HashMap::new(),
        }
    }

    /// Register a model family
    pub fn register_family(&mut self, family: ModelFamily) {
        self.families.insert(family.name.clone(), family);
    }

    /// Get a family by name
    pub fn get_family(&self, name: &str) -> Option<&ModelFamily> {
        self.families.get(name)
    }

    /// List all families
    pub fn list_families(&self) -> Vec<&ModelFamily> {
        self.families.values().collect()
    }

    /// Get default version for a family
    pub fn get_default_version(&self, family_name: &str) -> Option<&ModelVersion> {
        let family = self.families.get(family_name)?;
        family
            .versions
            .iter()
            .find(|v| v.id == family.default_version)
    }
}

impl Default for ModelFamilyRegistry {
    fn default() -> Self {
        Self::new()
    }
}

/// Qwen family configuration
pub fn qwen_family() -> ModelFamily {
    ModelFamily {
        name: "qwen".to_string(),
        description: "Alibaba's Qwen family of language models".to_string(),
        versions: vec![
            ModelVersion {
                id: "7b".to_string(),
                version: "1.0.0".to_string(),
                parameters: 7_000_000_000,
                path: "models/qwen-7b".to_string(),
                quantization: "fp16".to_string(),
            },
            ModelVersion {
                id: "14b".to_string(),
                version: "1.0.0".to_string(),
                parameters: 14_000_000_000,
                path: "models/qwen-14b".to_string(),
                quantization: "fp16".to_string(),
            },
        ],
        default_version: "7b".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_registry_creation() {
        let registry = ModelFamilyRegistry::new();
        assert_eq!(registry.families.len(), 0);
    }

    #[test]
    fn test_register_family() {
        let mut registry = ModelFamilyRegistry::new();
        let family = qwen_family();
        registry.register_family(family.clone());

        let retrieved = registry.get_family("qwen").unwrap();
        assert_eq!(retrieved.name, "qwen");
    }

    #[test]
    fn test_get_default_version() {
        let mut registry = ModelFamilyRegistry::new();
        let family = qwen_family();
        registry.register_family(family);

        let version = registry.get_default_version("qwen").unwrap();
        assert_eq!(version.id, "7b");
    }

    #[test]
    fn test_list_families() {
        let mut registry = ModelFamilyRegistry::new();
        registry.register_family(qwen_family());

        let families = registry.list_families();
        assert_eq!(families.len(), 1);
        assert_eq!(families[0].name, "qwen");
    }
}
