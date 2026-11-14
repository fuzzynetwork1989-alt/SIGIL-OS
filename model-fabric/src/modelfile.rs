//! Modelfile format and parser
//!
//! Modelfile is a configuration format for defining how to run models,
//! inspired by Ollama's Modelfile format with SIGIL-specific extensions.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::ModelFabricError;

/// Modelfile structure with SIGIL extensions
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

    /// SIGIL-specific sections
    #[serde(default)]
    pub sigil: Option<SigilConfig>,
}

/// SIGIL cognitive architecture configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SigilConfig {
    /// Cognitive assembly configuration
    #[serde(default)]
    pub cognitive_assembly: Option<CognitiveAssemblyConfig>,

    /// Memory system configuration
    #[serde(default)]
    pub memory_system: Option<MemorySystemConfig>,

    /// World model configuration
    #[serde(default)]
    pub world_model: Option<WorldModelConfig>,

    /// Mission context configuration
    #[serde(default)]
    pub mission_context: Option<MissionContextConfig>,

    /// Presence intelligence configuration
    #[serde(default)]
    pub presence_intelligence: Option<PresenceIntelligenceConfig>,

    /// Reality validation configuration
    #[serde(default)]
    pub reality_validation: Option<RealityValidationConfig>,

    /// Model coordination configuration
    #[serde(default)]
    pub model_coordination: Option<ModelCoordinationConfig>,

    /// Reflection system configuration
    #[serde(default)]
    pub reflection_system: Option<ReflectionSystemConfig>,
}

/// Cognitive assembly configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CognitiveAssemblyConfig {
    /// Enable cognitive assembly
    #[serde(default)]
    pub enable: bool,

    /// Context sources
    #[serde(default)]
    pub sources: Vec<String>,

    /// Assembly strategy
    #[serde(default)]
    pub assembly_strategy: String,

    /// Context window size
    #[serde(default)]
    pub context_window: usize,

    /// Max context per source
    #[serde(default)]
    pub max_context_per_source: usize,

    /// Source weights
    #[serde(default)]
    pub identity_weight: f32,
    #[serde(default)]
    pub mission_weight: f32,
    #[serde(default)]
    pub memory_weight: f32,
    #[serde(default)]
    pub world_weight: f32,
    #[serde(default)]
    pub spatial_weight: f32,
    #[serde(default)]
    pub tools_weight: f32,

    /// Assembly timeout in milliseconds
    #[serde(default)]
    pub assembly_timeout_ms: u64,

    /// Fallback strategy
    #[serde(default)]
    pub fallback_strategy: String,
}

/// Memory system configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemorySystemConfig {
    /// Enable memory system
    #[serde(default)]
    pub enable: bool,

    /// Memory types
    #[serde(default)]
    pub memory_types: Vec<String>,

    /// Retrieval strategy
    #[serde(default)]
    pub retrieval_strategy: String,

    /// Max memories per query
    #[serde(default)]
    pub max_memories_per_query: usize,

    /// Memory importance threshold
    #[serde(default)]
    pub memory_importance_threshold: f32,

    /// Enable memory decay
    #[serde(default)]
    pub memory_decay_enabled: bool,

    /// Memory decay rate
    #[serde(default)]
    pub memory_decay_rate: f32,

    /// Memory weights
    #[serde(default)]
    pub episodic_memory_weight: f32,
    #[serde(default)]
    pub semantic_memory_weight: f32,
    #[serde(default)]
    pub mission_memory_weight: f32,
    #[serde(default)]
    pub spatial_memory_weight: f32,
    #[serde(default)]
    pub identity_memory_weight: f32,

    /// Memory embedding dimension
    #[serde(default)]
    pub memory_embedding_dim: usize,

    /// Memory index type
    #[serde(default)]
    pub memory_index_type: String,

    /// Memory cache size in MB
    #[serde(default)]
    pub memory_cache_size_mb: usize,
}

/// World model configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorldModelConfig {
    /// Enable world model
    #[serde(default)]
    pub enable: bool,

    /// Enable entity tracking
    #[serde(default)]
    pub entity_tracking: bool,

    /// Enable temporal awareness
    #[serde(default)]
    pub temporal_awareness: bool,

    /// Enable causal reasoning
    #[serde(default)]
    pub causal_reasoning: bool,

    /// Enable contradiction detection
    #[serde(default)]
    pub contradiction_detection: bool,

    /// Enable world state persistence
    #[serde(default)]
    pub world_state_persistence: bool,

    /// Max entities
    #[serde(default)]
    pub max_entities: usize,

    /// Entity confidence threshold
    #[serde(default)]
    pub entity_confidence_threshold: f32,

    /// Temporal horizon
    #[serde(default)]
    pub temporal_horizon: String,

    /// Causal depth
    #[serde(default)]
    pub causal_depth: usize,
}

/// Mission context configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionContextConfig {
    /// Enable mission context
    #[serde(default)]
    pub enable: bool,

    /// Enable mission awareness
    #[serde(default)]
    pub mission_awareness: bool,

    /// Enable goal tracking
    #[serde(default)]
    pub goal_tracking: bool,

    /// Enable milestone awareness
    #[serde(default)]
    pub milestone_awareness: bool,

    /// Enable dependency tracking
    #[serde(default)]
    pub dependency_tracking: bool,

    /// Mission integration strategy
    #[serde(default)]
    pub mission_integration_strategy: String,

    /// Max active missions
    #[serde(default)]
    pub max_active_missions: usize,

    /// Enable mission priority weighting
    #[serde(default)]
    pub mission_priority_weighting: bool,

    /// Enable deadline awareness
    #[serde(default)]
    pub deadline_awareness: bool,
}

/// Presence intelligence configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceIntelligenceConfig {
    /// Enable presence intelligence
    #[serde(default)]
    pub enable: bool,

    /// Enable avatar awareness
    #[serde(default)]
    pub avatar_awareness: bool,

    /// Enable spatial awareness
    #[serde(default)]
    pub spatial_awareness: bool,

    /// Enable attention tracking
    #[serde(default)]
    pub attention_tracking: bool,

    /// Enable emotion modeling
    #[serde(default)]
    pub emotion_modeling: bool,

    /// Enable presence persistence
    #[serde(default)]
    pub presence_persistence: bool,

    /// Max attention targets
    #[serde(default)]
    pub max_attention_targets: usize,

    /// Enable gaze tracking
    #[serde(default)]
    pub gaze_tracking: bool,

    /// Enable gesture awareness
    #[serde(default)]
    pub gesture_awareness: bool,

    /// Presence update rate (fps)
    #[serde(default)]
    pub presence_update_rate: usize,

    /// Attention decay in milliseconds
    #[serde(default)]
    pub attention_decay_ms: u64,
}

/// Reality validation configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RealityValidationConfig {
    /// Enable reality validation
    #[serde(default)]
    pub enable: bool,

    /// Verification required
    #[serde(default)]
    pub verification_required: bool,

    /// Enable cross check
    #[serde(default)]
    pub cross_check_enabled: bool,

    /// Confidence threshold
    #[serde(default)]
    pub confidence_threshold: f32,

    /// Contradiction handling
    #[serde(default)]
    pub contradiction_handling: String,

    /// Unverified storage
    #[serde(default)]
    pub unverified_storage: String,

    /// Verification sources
    #[serde(default)]
    pub verification_sources: Vec<String>,

    /// Verification timeout in milliseconds
    #[serde(default)]
    pub verification_timeout_ms: u64,

    /// Contradiction threshold
    #[serde(default)]
    pub contradiction_threshold: f32,

    /// Source trust weights
    #[serde(default)]
    pub source_trust_weights: HashMap<String, f32>,
}

/// Model coordination configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelCoordinationConfig {
    /// Enable model coordination
    #[serde(default)]
    pub enable: bool,

    /// Routing strategy
    #[serde(default)]
    pub routing_strategy: String,

    /// Available models
    #[serde(default)]
    pub available_models: Vec<String>,

    /// Default model
    #[serde(default)]
    pub default_model: String,

    /// Fallback model
    #[serde(default)]
    pub fallback_model: String,

    /// Model selection criteria
    #[serde(default)]
    pub model_selection_criteria: Vec<String>,

    /// Complexity threshold
    #[serde(default)]
    pub complexity_threshold: f32,

    /// Latency budget in milliseconds
    #[serde(default)]
    pub latency_budget_ms: u64,

    /// Enable resource monitoring
    #[serde(default)]
    pub resource_monitoring: bool,

    /// Enable auto fallback
    #[serde(default)]
    pub auto_fallback_enabled: bool,
}

/// Reflection system configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReflectionSystemConfig {
    /// Enable reflection system
    #[serde(default)]
    pub enable: bool,

    /// Enable learning
    #[serde(default)]
    pub learning_enabled: bool,

    /// Enable self evaluation
    #[serde(default)]
    pub self_evaluation: bool,

    /// Enable performance tracking
    #[serde(default)]
    pub performance_tracking: bool,

    /// Enable adaptation
    #[serde(default)]
    pub adaptation_enabled: bool,

    /// Reflection interval
    #[serde(default)]
    pub reflection_interval: String,

    /// Max reflection history
    #[serde(default)]
    pub max_reflection_history: usize,

    /// Learning rate
    #[serde(default)]
    pub learning_rate: f32,

    /// Adaptation threshold
    #[serde(default)]
    pub adaptation_threshold: f32,

    /// Performance metrics
    #[serde(default)]
    pub performance_metrics: Vec<String>,

    /// Reflection storage
    #[serde(default)]
    pub reflection_storage: String,
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
        // Try SIGIL format first (custom format with sections)
        if let Ok(modelfile) = Self::parse_sigil_format(content) {
            return Ok(modelfile);
        }
        // Fall back to TOML
        if let Ok(modelfile) = Self::parse_toml(content) {
            return Ok(modelfile);
        }
        // Fall back to YAML
        if let Ok(modelfile) = Self::parse_yaml(content) {
            return Ok(modelfile);
        }
        Err(ModelFabricError::InvalidModelfile(
            "Could not parse as SIGIL format, TOML, or YAML".to_string(),
        ))
    }

    /// Parse a Modelfile from a file
    pub fn parse_file(path: &str) -> std::result::Result<Modelfile, ModelFabricError> {
        let content = std::fs::read_to_string(path)?;
        Self::parse_str(&content)
    }

    /// Parse SIGIL format (custom format with sections)
    fn parse_sigil_format(content: &str) -> std::result::Result<Modelfile, ModelFabricError> {
        let mut modelfile = Modelfile::default();
        let mut current_section: Option<String> = None;
        let mut sigil_config = SigilConfig::default();

        for line in content.lines() {
            let line = line.trim();
            
            // Skip empty lines and comments
            if line.is_empty() || line.starts_with('#') {
                continue;
            }

            // Handle FROM statement
            if line.starts_with("FROM ") {
                modelfile.model = line[5..].trim().to_string();
                continue;
            }

            // Handle PARAMETER statements
            if line.starts_with("PARAMETER ") {
                let parts: Vec<&str> = line[10..].split_whitespace().collect();
                if parts.len() >= 2 {
                    let key = parts[0];
                    let value = parts[1];
                    match key {
                        "temperature" => {
                            modelfile.parameters.temperature = value.parse().unwrap_or(0.7);
                        }
                        "top_p" => {
                            modelfile.parameters.top_p = value.parse().unwrap_or(0.9);
                        }
                        "top_k" => {
                            modelfile.parameters.top_k = value.parse().ok();
                        }
                        "num_ctx" => {
                            modelfile.parameters.max_tokens = value.parse().unwrap_or(512);
                        }
                        "repeat_penalty" => {
                            modelfile.parameters.repeat_penalty = value.parse().ok();
                        }
                        _ => {}
                    }
                }
                continue;
            }

            // Handle SYSTEM statement
            if line.starts_with("SYSTEM ") {
                let system_text = line[7..].trim();
                // Handle multi-line system prompts
                if system_text.starts_with("\"\"\"") {
                    // Multi-line - collect until closing """
                    continue; // For simplicity, skip multi-line for now
                } else {
                    modelfile.system = Some(system_text.trim_matches('"').to_string());
                }
                continue;
            }

            // Handle SIGIL section headers
            if line.starts_with('[') && line.ends_with(']') {
                current_section = Some(line[1..line.len()-1].to_string());
                continue;
            }

            // Handle section content
            if let Some(section) = &current_section {
                if section.starts_with("cognitive_assembly") {
                    Self::parse_cognitive_assembly_line(line, &mut sigil_config);
                } else if section.starts_with("memory_system") {
                    Self::parse_memory_system_line(line, &mut sigil_config);
                } else if section.starts_with("world_model") {
                    Self::parse_world_model_line(line, &mut sigil_config);
                } else if section.starts_with("mission_context") {
                    Self::parse_mission_context_line(line, &mut sigil_config);
                } else if section.starts_with("presence_intelligence") {
                    Self::parse_presence_intelligence_line(line, &mut sigil_config);
                } else if section.starts_with("reality_validation") {
                    Self::parse_reality_validation_line(line, &mut sigil_config);
                } else if section.starts_with("model_coordination") {
                    Self::parse_model_coordination_line(line, &mut sigil_config);
                } else if section.starts_with("reflection_system") {
                    Self::parse_reflection_system_line(line, &mut sigil_config);
                }
            }
        }

        // Only set sigil config if it has non-default values
        if sigil_config.cognitive_assembly.is_some()
            || sigil_config.memory_system.is_some()
            || sigil_config.world_model.is_some()
            || sigil_config.mission_context.is_some()
            || sigil_config.presence_intelligence.is_some()
            || sigil_config.reality_validation.is_some()
            || sigil_config.model_coordination.is_some()
            || sigil_config.reflection_system.is_some()
        {
            modelfile.sigil = Some(sigil_config);
        }

        Ok(modelfile)
    }

    /// Parse cognitive assembly line
    fn parse_cognitive_assembly_line(line: &str, config: &mut SigilConfig) {
        if config.cognitive_assembly.is_none() {
            config.cognitive_assembly = Some(CognitiveAssemblyConfig::default());
        }
        let section = config.cognitive_assembly.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "sources" => {
                    section.sources = value
                        .trim_matches(&['[', ']'] as &[_])
                        .split(',')
                        .map(|s| s.trim().trim_matches('"').to_string())
                        .collect();
                }
                "assembly_strategy" => section.assembly_strategy = value.to_string(),
                "context_window" => section.context_window = value.parse().unwrap_or(8192),
                "max_context_per_source" => section.max_context_per_source = value.parse().unwrap_or(2048),
                "identity_weight" => section.identity_weight = value.parse().unwrap_or(0.2),
                "mission_weight" => section.mission_weight = value.parse().unwrap_or(0.25),
                "memory_weight" => section.memory_weight = value.parse().unwrap_or(0.25),
                "world_weight" => section.world_weight = value.parse().unwrap_or(0.15),
                "spatial_weight" => section.spatial_weight = value.parse().unwrap_or(0.1),
                "tools_weight" => section.tools_weight = value.parse().unwrap_or(0.05),
                "assembly_timeout_ms" => section.assembly_timeout_ms = value.parse().unwrap_or(500),
                "fallback_strategy" => section.fallback_strategy = value.to_string(),
                _ => {}
            }
        }
    }

    /// Parse memory system line
    fn parse_memory_system_line(line: &str, config: &mut SigilConfig) {
        if config.memory_system.is_none() {
            config.memory_system = Some(MemorySystemConfig::default());
        }
        let section = config.memory_system.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "memory_types" => {
                    section.memory_types = value
                        .trim_matches(&['[', ']'] as &[_])
                        .split(',')
                        .map(|s| s.trim().trim_matches('"').to_string())
                        .collect();
                }
                "retrieval_strategy" => section.retrieval_strategy = value.to_string(),
                "max_memories_per_query" => section.max_memories_per_query = value.parse().unwrap_or(50),
                "memory_importance_threshold" => section.memory_importance_threshold = value.parse().unwrap_or(0.6),
                "memory_decay_enabled" => section.memory_decay_enabled = value == "true",
                "memory_decay_rate" => section.memory_decay_rate = value.parse().unwrap_or(0.95),
                "memory_embedding_dim" => section.memory_embedding_dim = value.parse().unwrap_or(1536),
                "memory_index_type" => section.memory_index_type = value.to_string(),
                "memory_cache_size_mb" => section.memory_cache_size_mb = value.parse().unwrap_or(512),
                _ => {}
            }
        }
    }

    /// Parse world model line
    fn parse_world_model_line(line: &str, config: &mut SigilConfig) {
        if config.world_model.is_none() {
            config.world_model = Some(WorldModelConfig::default());
        }
        let section = config.world_model.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "entity_tracking" => section.entity_tracking = value == "true",
                "temporal_awareness" => section.temporal_awareness = value == "true",
                "causal_reasoning" => section.causal_reasoning = value == "true",
                "contradiction_detection" => section.contradiction_detection = value == "true",
                "world_state_persistence" => section.world_state_persistence = value == "true",
                "max_entities" => section.max_entities = value.parse().unwrap_or(1000),
                "entity_confidence_threshold" => section.entity_confidence_threshold = value.parse().unwrap_or(0.7),
                "temporal_horizon" => section.temporal_horizon = value.to_string(),
                "causal_depth" => section.causal_depth = value.parse().unwrap_or(5),
                _ => {}
            }
        }
    }

    /// Parse mission context line
    fn parse_mission_context_line(line: &str, config: &mut SigilConfig) {
        if config.mission_context.is_none() {
            config.mission_context = Some(MissionContextConfig::default());
        }
        let section = config.mission_context.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "mission_awareness" => section.mission_awareness = value == "true",
                "goal_tracking" => section.goal_tracking = value == "true",
                "milestone_awareness" => section.milestone_awareness = value == "true",
                "dependency_tracking" => section.dependency_tracking = value == "true",
                "mission_integration_strategy" => section.mission_integration_strategy = value.to_string(),
                "max_active_missions" => section.max_active_missions = value.parse().unwrap_or(10),
                "mission_priority_weighting" => section.mission_priority_weighting = value == "true",
                "deadline_awareness" => section.deadline_awareness = value == "true",
                _ => {}
            }
        }
    }

    /// Parse presence intelligence line
    fn parse_presence_intelligence_line(line: &str, config: &mut SigilConfig) {
        if config.presence_intelligence.is_none() {
            config.presence_intelligence = Some(PresenceIntelligenceConfig::default());
        }
        let section = config.presence_intelligence.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "avatar_awareness" => section.avatar_awareness = value == "true",
                "spatial_awareness" => section.spatial_awareness = value == "true",
                "attention_tracking" => section.attention_tracking = value == "true",
                "emotion_modeling" => section.emotion_modeling = value == "true",
                "presence_persistence" => section.presence_persistence = value == "true",
                "max_attention_targets" => section.max_attention_targets = value.parse().unwrap_or(5),
                "gaze_tracking" => section.gaze_tracking = value == "true",
                "gesture_awareness" => section.gesture_awareness = value == "true",
                "presence_update_rate" => section.presence_update_rate = value.parse().unwrap_or(60),
                "attention_decay_ms" => section.attention_decay_ms = value.parse().unwrap_or(5000),
                _ => {}
            }
        }
    }

    /// Parse reality validation line
    fn parse_reality_validation_line(line: &str, config: &mut SigilConfig) {
        if config.reality_validation.is_none() {
            config.reality_validation = Some(RealityValidationConfig::default());
        }
        let section = config.reality_validation.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "verification_required" => section.verification_required = value == "true",
                "cross_check_enabled" => section.cross_check_enabled = value == "true",
                "confidence_threshold" => section.confidence_threshold = value.parse().unwrap_or(0.8),
                "contradiction_handling" => section.contradiction_handling = value.to_string(),
                "unverified_storage" => section.unverified_storage = value.to_string(),
                "verification_timeout_ms" => section.verification_timeout_ms = value.parse().unwrap_or(1000),
                "contradiction_threshold" => section.contradiction_threshold = value.parse().unwrap_or(0.7),
                _ => {}
            }
        }
    }

    /// Parse model coordination line
    fn parse_model_coordination_line(line: &str, config: &mut SigilConfig) {
        if config.model_coordination.is_none() {
            config.model_coordination = Some(ModelCoordinationConfig::default());
        }
        let section = config.model_coordination.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "routing_strategy" => section.routing_strategy = value.to_string(),
                "default_model" => section.default_model = value.to_string(),
                "fallback_model" => section.fallback_model = value.to_string(),
                "complexity_threshold" => section.complexity_threshold = value.parse().unwrap_or(0.7),
                "latency_budget_ms" => section.latency_budget_ms = value.parse().unwrap_or(2000),
                "resource_monitoring" => section.resource_monitoring = value == "true",
                "auto_fallback_enabled" => section.auto_fallback_enabled = value == "true",
                _ => {}
            }
        }
    }

    /// Parse reflection system line
    fn parse_reflection_system_line(line: &str, config: &mut SigilConfig) {
        if config.reflection_system.is_none() {
            config.reflection_system = Some(ReflectionSystemConfig::default());
        }
        let section = config.reflection_system.as_mut().unwrap();
        
        if let Some((key, value)) = line.split_once('=') {
            let key = key.trim();
            let value = value.trim();
            match key {
                "enable" => section.enable = value == "true",
                "learning_enabled" => section.learning_enabled = value == "true",
                "self_evaluation" => section.self_evaluation = value == "true",
                "performance_tracking" => section.performance_tracking = value == "true",
                "adaptation_enabled" => section.adaptation_enabled = value == "true",
                "reflection_interval" => section.reflection_interval = value.to_string(),
                "max_reflection_history" => section.max_reflection_history = value.parse().unwrap_or(100),
                "learning_rate" => section.learning_rate = value.parse().unwrap_or(0.01),
                "adaptation_threshold" => section.adaptation_threshold = value.parse().unwrap_or(0.8),
                _ => {}
            }
        }
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
            sigil: None,
        }
    }
}

impl Default for SigilConfig {
    fn default() -> Self {
        Self {
            cognitive_assembly: None,
            memory_system: None,
            world_model: None,
            mission_context: None,
            presence_intelligence: None,
            reality_validation: None,
            model_coordination: None,
            reflection_system: None,
        }
    }
}

impl Default for CognitiveAssemblyConfig {
    fn default() -> Self {
        Self {
            enable: false,
            sources: Vec::new(),
            assembly_strategy: String::new(),
            context_window: 8192,
            max_context_per_source: 2048,
            identity_weight: 0.2,
            mission_weight: 0.25,
            memory_weight: 0.25,
            world_weight: 0.15,
            spatial_weight: 0.1,
            tools_weight: 0.05,
            assembly_timeout_ms: 500,
            fallback_strategy: String::new(),
        }
    }
}

impl Default for MemorySystemConfig {
    fn default() -> Self {
        Self {
            enable: false,
            memory_types: Vec::new(),
            retrieval_strategy: String::new(),
            max_memories_per_query: 50,
            memory_importance_threshold: 0.6,
            memory_decay_enabled: false,
            memory_decay_rate: 0.95,
            episodic_memory_weight: 0.3,
            semantic_memory_weight: 0.4,
            mission_memory_weight: 0.2,
            spatial_memory_weight: 0.05,
            identity_memory_weight: 0.05,
            memory_embedding_dim: 1536,
            memory_index_type: String::new(),
            memory_cache_size_mb: 512,
        }
    }
}

impl Default for WorldModelConfig {
    fn default() -> Self {
        Self {
            enable: false,
            entity_tracking: false,
            temporal_awareness: false,
            causal_reasoning: false,
            contradiction_detection: false,
            world_state_persistence: false,
            max_entities: 1000,
            entity_confidence_threshold: 0.7,
            temporal_horizon: String::new(),
            causal_depth: 5,
        }
    }
}

impl Default for MissionContextConfig {
    fn default() -> Self {
        Self {
            enable: false,
            mission_awareness: false,
            goal_tracking: false,
            milestone_awareness: false,
            dependency_tracking: false,
            mission_integration_strategy: String::new(),
            max_active_missions: 10,
            mission_priority_weighting: false,
            deadline_awareness: false,
        }
    }
}

impl Default for PresenceIntelligenceConfig {
    fn default() -> Self {
        Self {
            enable: false,
            avatar_awareness: false,
            spatial_awareness: false,
            attention_tracking: false,
            emotion_modeling: false,
            presence_persistence: false,
            max_attention_targets: 5,
            gaze_tracking: false,
            gesture_awareness: false,
            presence_update_rate: 60,
            attention_decay_ms: 5000,
        }
    }
}

impl Default for RealityValidationConfig {
    fn default() -> Self {
        Self {
            enable: false,
            verification_required: false,
            cross_check_enabled: false,
            confidence_threshold: 0.8,
            contradiction_handling: String::new(),
            unverified_storage: String::new(),
            verification_sources: Vec::new(),
            verification_timeout_ms: 1000,
            contradiction_threshold: 0.7,
            source_trust_weights: HashMap::new(),
        }
    }
}

impl Default for ModelCoordinationConfig {
    fn default() -> Self {
        Self {
            enable: false,
            routing_strategy: String::new(),
            available_models: Vec::new(),
            default_model: String::new(),
            fallback_model: String::new(),
            model_selection_criteria: Vec::new(),
            complexity_threshold: 0.7,
            latency_budget_ms: 2000,
            resource_monitoring: false,
            auto_fallback_enabled: false,
        }
    }
}

impl Default for ReflectionSystemConfig {
    fn default() -> Self {
        Self {
            enable: false,
            learning_enabled: false,
            self_evaluation: false,
            performance_tracking: false,
            adaptation_enabled: false,
            reflection_interval: String::new(),
            max_reflection_history: 100,
            learning_rate: 0.01,
            adaptation_threshold: 0.8,
            performance_metrics: Vec::new(),
            reflection_storage: String::new(),
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
            sigil: None,
        };

        let toml = ModelfileParser::to_toml(&modelfile).unwrap();
        assert!(toml.contains("model = \"qwen:7b\""));
        assert!(toml.contains("family = \"qwen\""));
    }

    #[test]
    fn test_parse_sigil_format() {
        let content = r#"
FROM qwen:7b
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 8192

[cognitive_assembly]
enable = true
sources = ["identity", "mission", "memory", "world", "spatial", "tools"]
assembly_strategy = "weighted_priority"
context_window = 8192
identity_weight = 0.2
mission_weight = 0.25
memory_weight = 0.25

[memory_system]
enable = true
memory_types = ["episodic", "semantic", "mission"]
max_memories_per_query = 50
memory_importance_threshold = 0.6
"#;
        let modelfile = ModelfileParser::parse_str(content).unwrap();
        assert_eq!(modelfile.model, "qwen:7b");
        assert_eq!(modelfile.parameters.temperature, 0.7);
        assert_eq!(modelfile.parameters.top_p, 0.9);
        assert_eq!(modelfile.parameters.max_tokens, 8192);
        
        // Check SIGIL config
        assert!(modelfile.sigil.is_some());
        let sigil = modelfile.sigil.unwrap();
        assert!(sigil.cognitive_assembly.is_some());
        assert!(sigil.memory_system.is_some());
        
        let cognitive = sigil.cognitive_assembly.unwrap();
        assert!(cognitive.enable);
        assert_eq!(cognitive.sources.len(), 6);
        assert_eq!(cognitive.assembly_strategy, "weighted_priority");
        assert_eq!(cognitive.identity_weight, 0.2);
        
        let memory = sigil.memory_system.unwrap();
        assert!(memory.enable);
        assert_eq!(memory.memory_types.len(), 3);
        assert_eq!(memory.max_memories_per_query, 50);
    }

    #[test]
    fn test_parse_sigil_without_sections() {
        let content = r#"
FROM qwen:7b
PARAMETER temperature 0.7
"#;
        let modelfile = ModelfileParser::parse_str(content).unwrap();
        assert_eq!(modelfile.model, "qwen:7b");
        assert_eq!(modelfile.parameters.temperature, 0.7);
        // SIGIL config should be None when no SIGIL sections present
        assert!(modelfile.sigil.is_none());
    }

    #[test]
    fn test_parse_sigil_world_model() {
        let content = r#"
FROM qwen:14b

[world_model]
enable = true
entity_tracking = true
temporal_awareness = true
causal_reasoning = true
contradiction_detection = true
max_entities = 10000
temporal_horizon = "90_days"
causal_depth = 10
"#;
        let modelfile = ModelfileParser::parse_str(content).unwrap();
        assert!(modelfile.sigil.is_some());
        let sigil = modelfile.sigil.unwrap();
        assert!(sigil.world_model.is_some());
        
        let world = sigil.world_model.unwrap();
        assert!(world.enable);
        assert!(world.entity_tracking);
        assert!(world.temporal_awareness);
        assert!(world.causal_reasoning);
        assert!(world.contradiction_detection);
        assert_eq!(world.max_entities, 10000);
        assert_eq!(world.temporal_horizon, "90_days");
        assert_eq!(world.causal_depth, 10);
    }

    #[test]
    fn test_parse_sigil_model_coordination() {
        let content = r#"
FROM qwen:7b

[model_coordination]
enable = true
routing_strategy = "cognitive"
available_models = ["core", "forge", "atlas", "recall", "sentinel", "vision", "voice", "edge"]
default_model = "core"
fallback_model = "edge"
complexity_threshold = 0.7
latency_budget_ms = 2000
"#;
        let modelfile = ModelfileParser::parse_str(content).unwrap();
        assert!(modelfile.sigil.is_some());
        let sigil = modelfile.sigil.unwrap();
        assert!(sigil.model_coordination.is_some());
        
        let coord = sigil.model_coordination.unwrap();
        assert!(coord.enable);
        assert_eq!(coord.routing_strategy, "cognitive");
        assert_eq!(coord.available_models.len(), 8);
        assert_eq!(coord.default_model, "core");
        assert_eq!(coord.fallback_model, "edge");
        assert_eq!(coord.complexity_threshold, 0.7);
        assert_eq!(coord.latency_budget_ms, 2000);
    }
}
