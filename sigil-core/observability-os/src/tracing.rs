//! Tracing

pub struct Tracer;

impl Tracer {
    pub fn new() -> Self {
        Self
    }
}

impl Default for Tracer {
    fn default() -> Self {
        Self::new()
    }
}
