//! Health checks for system components

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Health check status
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum HealthStatus {
    Healthy,
    Degraded,
    Unhealthy,
}

/// Component health status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComponentHealth {
    pub status: HealthStatus,
    pub message: String,
    pub last_check: chrono::DateTime<chrono::Utc>,
}

/// Overall health check response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthCheckResponse {
    pub status: HealthStatus,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub components: HashMap<String, ComponentHealth>,
}

/// Health checker
pub struct HealthChecker {
    components: HashMap<String, HealthStatus>,
}

impl HealthChecker {
    /// Create a new health checker
    pub fn new() -> Self {
        Self {
            components: HashMap::new(),
        }
    }

    /// Register a component
    pub fn register_component(&mut self, name: impl Into<String>) {
        self.components.insert(name.into(), HealthStatus::Healthy);
    }

    /// Update component status
    pub fn update_component(&mut self, name: impl Into<String>, status: HealthStatus) {
        self.components.insert(name.into(), status);
    }

    /// Perform health check
    pub fn check(&self) -> HealthCheckResponse {
        let mut components = HashMap::new();
        let mut overall_status = HealthStatus::Healthy;

        for (name, status) in &self.components {
            components.insert(
                name.clone(),
                ComponentHealth {
                    status: status.clone(),
                    message: match status {
                        HealthStatus::Healthy => "Component is healthy".to_string(),
                        HealthStatus::Degraded => "Component is degraded".to_string(),
                        HealthStatus::Unhealthy => "Component is unhealthy".to_string(),
                    },
                    last_check: chrono::Utc::now(),
                },
            );

            // Determine overall status
            if *status == HealthStatus::Unhealthy {
                overall_status = HealthStatus::Unhealthy;
            } else if *status == HealthStatus::Degraded && overall_status == HealthStatus::Healthy {
                overall_status = HealthStatus::Degraded;
            }
        }

        HealthCheckResponse {
            status: overall_status,
            timestamp: chrono::Utc::now(),
            components,
        }
    }
}

impl Default for HealthChecker {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_health_checker() {
        let mut checker = HealthChecker::new();
        checker.register_component("database");
        checker.register_component("model");

        let response = checker.check();
        assert_eq!(response.status, HealthStatus::Healthy);
        assert_eq!(response.components.len(), 2);
    }

    #[test]
    fn test_unhealthy_component() {
        let mut checker = HealthChecker::new();
        checker.register_component("database");
        checker.update_component("database", HealthStatus::Unhealthy);

        let response = checker.check();
        assert_eq!(response.status, HealthStatus::Unhealthy);
    }

    #[test]
    fn test_degraded_component() {
        let mut checker = HealthChecker::new();
        checker.register_component("database");
        checker.update_component("database", HealthStatus::Degraded);

        let response = checker.check();
        assert_eq!(response.status, HealthStatus::Degraded);
    }
}
