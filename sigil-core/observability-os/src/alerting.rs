//! Alerting

pub struct AlertManager;

impl AlertManager {
    pub fn new() -> Self {
        Self
    }
}

impl Default for AlertManager {
    fn default() -> Self {
        Self::new()
    }
}
