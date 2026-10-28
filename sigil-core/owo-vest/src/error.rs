//! OWO Vest error types

use thiserror::Error;

#[derive(Debug, Error)]
pub enum OwoVestError {
    #[error("OWO Vest not connected")]
    NotConnected,
    
    #[error("Connection failed: {0}")]
    ConnectionFailed(String),
    
    #[error("Haptic command failed: {0}")]
    HapticCommandFailed(String),
    
    #[error("Invalid haptic pattern: {0}")]
    InvalidPattern(String),
    
    #[error("Device not found")]
    DeviceNotFound,
    
    #[error("SDK error: {0}")]
    SdkError(String),
}
