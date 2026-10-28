//! OWO Vest Integration for SIGIL OS
//! 
//! This module provides haptic feedback integration with OWO Vest
//! for immersive gaming and AI companion experiences.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;
use uuid::Uuid;

pub use error::OwoVestError;

mod error;

/// Haptic pattern types for different experiences
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum HapticPattern {
    /// Gentle notification
    Notification,
    /// AI response pulse
    AIResponse,
    /// Achievement unlock celebration
    Achievement,
    /// Error warning
    Error,
    /// Heartbeat (for emotional connection)
    Heartbeat,
    /// Typing simulation
    Typing,
    /// Custom pattern
    Custom { name: String, points: Vec<HapticPoint> },
}

/// Haptic point on the vest
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HapticPoint {
    /// Location on the vest (0-100)
    pub location: f32,
    /// Intensity (0-100)
    pub intensity: f32,
    /// Duration in milliseconds
    pub duration: u32,
}

/// OWO Vest connection state
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ConnectionState {
    Disconnected,
    Connecting,
    Connected,
    Error(String),
}

/// OWO Vest configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OwoVestConfig {
    /// Auto-connect on startup
    pub auto_connect: bool,
    /// Default intensity (0-100)
    pub default_intensity: f32,
    /// Enable haptic feedback for AI responses
    pub ai_response_haptics: bool,
    /// Enable heartbeat for emotional connection
    pub heartbeat_enabled: bool,
    /// Custom patterns
    pub custom_patterns: HashMap<String, Vec<HapticPoint>>,
}

impl Default for OwoVestConfig {
    fn default() -> Self {
        let mut custom_patterns = HashMap::new();
        
        // Default custom patterns
        custom_patterns.insert("greeting".to_string(), vec![
            HapticPoint { location: 50.0, intensity: 50.0, duration: 200 },
            HapticPoint { location: 30.0, intensity: 30.0, duration: 150 },
            HapticPoint { location: 70.0, intensity: 30.0, duration: 150 },
        ]);
        
        custom_patterns.insert("thinking".to_string(), vec![
            HapticPoint { location: 50.0, intensity: 20.0, duration: 100 },
        ]);
        
        Self {
            auto_connect: true,
            default_intensity: 50.0,
            ai_response_haptics: true,
            heartbeat_enabled: true,
            custom_patterns,
        }
    }
}

/// OWO Vest manager
pub struct OwoVestManager {
    config: OwoVestConfig,
    state: ConnectionState,
    connected_device_id: Option<Uuid>,
}

impl OwoVestManager {
    /// Create a new OWO Vest manager
    pub fn new(config: OwoVestConfig) -> Self {
        Self {
            config,
            state: ConnectionState::Disconnected,
            connected_device_id: None,
        }
    }
    
    /// Connect to OWO Vest
    pub async fn connect(&mut self) -> Result<(), OwoVestError> {
        self.state = ConnectionState::Connecting;
        
        // TODO: Implement actual OWO Vest SDK connection
        // For now, simulate connection
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        
        self.state = ConnectionState::Connected;
        self.connected_device_id = Some(Uuid::new_v4());
        
        Ok(())
    }
    
    /// Disconnect from OWO Vest
    pub async fn disconnect(&mut self) -> Result<(), OwoVestError> {
        self.state = ConnectionState::Disconnected;
        self.connected_device_id = None;
        Ok(())
    }
    
    /// Trigger a haptic pattern
    pub async fn trigger_pattern(&self, pattern: HapticPattern) -> Result<(), OwoVestError> {
        if self.state != ConnectionState::Connected {
            return Err(OwoVestError::NotConnected);
        }
        
        let points = match pattern {
            HapticPattern::Notification => vec![
                HapticPoint { location: 50.0, intensity: 40.0, duration: 150 },
            ],
            HapticPattern::AIResponse => vec![
                HapticPoint { location: 50.0, intensity: self.config.default_intensity, duration: 200 },
                HapticPoint { location: 30.0, intensity: self.config.default_intensity * 0.7, duration: 150 },
                HapticPoint { location: 70.0, intensity: self.config.default_intensity * 0.7, duration: 150 },
            ],
            HapticPattern::Achievement => vec![
                HapticPoint { location: 20.0, intensity: 80.0, duration: 100 },
                HapticPoint { location: 50.0, intensity: 100.0, duration: 150 },
                HapticPoint { location: 80.0, intensity: 80.0, duration: 100 },
            ],
            HapticPattern::Error => vec![
                HapticPoint { location: 50.0, intensity: 60.0, duration: 100 },
                HapticPoint { location: 50.0, intensity: 60.0, duration: 100 },
            ],
            HapticPattern::Heartbeat => vec![
                HapticPoint { location: 50.0, intensity: 30.0, duration: 200 },
            ],
            HapticPattern::Typing => vec![
                HapticPoint { location: 50.0, intensity: 15.0, duration: 50 },
            ],
            HapticPattern::Custom { points, .. } => points,
        };
        
        // TODO: Send actual haptic commands to OWO Vest
        self.send_haptics(&points).await?;
        
        Ok(())
    }
    
    /// Send haptic points to the vest
    async fn send_haptics(&self, points: &[HapticPoint]) -> Result<(), OwoVestError> {
        // TODO: Implement actual OWO Vest haptic command sending
        // For now, log the haptic feedback
        for point in points {
            println!(
                "Haptic: location={}, intensity={}, duration={}ms",
                point.location, point.intensity, point.duration
            );
        }
        
        Ok(())
    }
    
    /// Get current connection state
    pub fn state(&self) -> &ConnectionState {
        &self.state
    }
    
    /// Get configuration
    pub fn config(&self) -> &OwoVestConfig {
        &self.config
    }
    
    /// Update configuration
    pub fn update_config(&mut self, config: OwoVestConfig) {
        self.config = config;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_default_config() {
        let config = OwoVestConfig::default();
        assert!(config.auto_connect);
        assert_eq!(config.default_intensity, 50.0);
        assert!(config.ai_response_haptics);
    }
    
    #[test]
    fn test_manager_creation() {
        let config = OwoVestConfig::default();
        let manager = OwoVestManager::new(config);
        assert_eq!(manager.state(), &ConnectionState::Disconnected);
    }
}
