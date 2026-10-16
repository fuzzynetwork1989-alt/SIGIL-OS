//! Logging

pub struct Logger;

impl Logger {
    pub fn new() -> Self {
        Self
    }
}

impl Default for Logger {
    fn default() -> Self {
        Self::new()
    }
}
