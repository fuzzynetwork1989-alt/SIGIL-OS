//! Configuration management for SIGIL OS
//!
//! This module provides configuration loading from environment variables and config files.

use serde::{Deserialize, Serialize};
use std::env;
use std::path::PathBuf;

/// SIGIL OS configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    /// Server configuration
    pub server: ServerConfig,
    /// Database configuration
    pub database: DatabaseConfig,
    /// Logging configuration
    pub logging: LoggingConfig,
    /// Sigil configuration
    pub sigil: SigilConfig,
}

/// Server configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    /// Host address to bind to
    pub host: String,
    /// Port to listen on
    pub port: u16,
    /// Enable CORS
    pub cors_enabled: bool,
}

/// Database configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    /// Database path
    pub path: PathBuf,
    /// Connection pool size
    pub pool_size: u32,
}

/// Logging configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    /// Log level (trace, debug, info, warn, error)
    pub level: String,
    /// Log format (json, pretty)
    pub format: String,
}

/// Sigil configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SigilConfig {
    /// Enable cryptographic warrants
    pub warrants_enabled: bool,
    /// Enable ledger
    pub ledger_enabled: bool,
    /// Default key pair path (optional)
    pub key_pair_path: Option<PathBuf>,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            server: ServerConfig {
                host: env::var("SIGIL_HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
                port: env::var("SIGIL_PORT")
                    .ok()
                    .and_then(|p| p.parse().ok())
                    .unwrap_or(8080),
                cors_enabled: env::var("SIGIL_CORS_ENABLED")
                    .ok()
                    .and_then(|v| v.parse().ok())
                    .unwrap_or(true),
            },
            database: DatabaseConfig {
                path: PathBuf::from(
                    env::var("SIGIL_DB_PATH").unwrap_or_else(|_| "sigil.db".to_string())
                ),
                pool_size: env::var("SIGIL_DB_POOL_SIZE")
                    .ok()
                    .and_then(|p| p.parse().ok())
                    .unwrap_or(10),
            },
            logging: LoggingConfig {
                level: env::var("SIGIL_LOG_LEVEL").unwrap_or_else(|_| "info".to_string()),
                format: env::var("SIGIL_LOG_FORMAT").unwrap_or_else(|_| "pretty".to_string()),
            },
            sigil: SigilConfig {
                warrants_enabled: env::var("SIGIL_WARRANTS_ENABLED")
                    .ok()
                    .and_then(|v| v.parse().ok())
                    .unwrap_or(true),
                ledger_enabled: env::var("SIGIL_LEDGER_ENABLED")
                    .ok()
                    .and_then(|v| v.parse().ok())
                    .unwrap_or(true),
                key_pair_path: env::var("SIGIL_KEY_PAIR_PATH").ok().map(PathBuf::from),
            },
        }
    }
}

impl Config {
    /// Load configuration from environment variables
    pub fn from_env() -> Self {
        Self::default()
    }

    /// Load configuration from a file
    pub fn from_file(path: PathBuf) -> anyhow::Result<Self> {
        let content = std::fs::read_to_string(&path)?;
        let config: Config = toml::from_str(&content)?;
        Ok(config)
    }

    /// Load configuration from file, falling back to environment variables
    pub fn load() -> Self {
        // Try to load from config file first
        if let Ok(config_path) = env::var("SIGIL_CONFIG") {
            if let Ok(config) = Self::from_file(PathBuf::from(config_path)) {
                return config;
            }
        }

        // Check for default config files
        for path in [
            PathBuf::from("sigil.toml"),
            PathBuf::from(".sigil.toml"),
            PathBuf::from("config/sigil.toml"),
        ] {
            if path.exists() {
                if let Ok(config) = Self::from_file(path) {
                    return config;
                }
            }
        }

        // Fall back to environment variables
        Self::from_env()
    }

    /// Get the server bind address
    pub fn server_address(&self) -> String {
        format!("{}:{}", self.server.host, self.server.port)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = Config::default();
        assert_eq!(config.server.port, 8080);
        assert_eq!(config.server.host, "0.0.0.0");
        assert_eq!(config.logging.level, "info");
    }

    #[test]
    fn test_server_address() {
        let config = Config::default();
        assert_eq!(config.server_address(), "0.0.0.0:8080");
    }
}
