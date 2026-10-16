//! Metrics collection

use std::collections::HashMap;
use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};

#[derive(Clone)]
pub struct Counter {
    value: Arc<AtomicU64>,
}

impl Counter {
    pub fn new() -> Self {
        Self {
            value: Arc::new(AtomicU64::new(0)),
        }
    }

    pub fn increment(&self) {
        self.value.fetch_add(1, Ordering::Relaxed);
    }

    pub fn get(&self) -> u64 {
        self.value.load(Ordering::Relaxed)
    }
}

#[derive(Clone)]
pub struct Gauge {
    value: Arc<AtomicU64>,
}

impl Gauge {
    pub fn new() -> Self {
        Self {
            value: Arc::new(AtomicU64::new(0)),
        }
    }

    pub fn set(&self, value: u64) {
        self.value.store(value, Ordering::Relaxed);
    }

    pub fn get(&self) -> u64 {
        self.value.load(Ordering::Relaxed)
    }
}

pub struct MetricsCollector {
    counters: HashMap<String, Counter>,
    gauges: HashMap<String, Gauge>,
}

impl MetricsCollector {
    pub fn new() -> Self {
        Self {
            counters: HashMap::new(),
            gauges: HashMap::new(),
        }
    }

    pub fn counter(&mut self, name: String) -> Counter {
        if !self.counters.contains_key(&name) {
            self.counters.insert(name.clone(), Counter::new());
        }
        self.counters.get(&name).unwrap().clone()
    }

    pub fn gauge(&mut self, name: String) -> Gauge {
        if !self.gauges.contains_key(&name) {
            self.gauges.insert(name.clone(), Gauge::new());
        }
        self.gauges.get(&name).unwrap().clone()
    }
}

impl Default for MetricsCollector {
    fn default() -> Self {
        Self::new()
    }
}
