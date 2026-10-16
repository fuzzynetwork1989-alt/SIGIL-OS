//! Error handling and retry logic

use anyhow::Result;
use std::time::Duration;
use tokio::time::sleep;

/// Retry configuration
#[derive(Clone, Debug)]
pub struct RetryConfig {
    pub max_attempts: u32,
    pub initial_delay: Duration,
    pub max_delay: Duration,
    pub backoff_multiplier: f64,
}

impl Default for RetryConfig {
    fn default() -> Self {
        Self {
            max_attempts: 3,
            initial_delay: Duration::from_millis(100),
            max_delay: Duration::from_secs(10),
            backoff_multiplier: 2.0,
        }
    }
}

/// Retry an operation with exponential backoff
pub async fn retry_with_backoff<F, Fut, T, E>(config: RetryConfig, operation: F) -> Result<T>
where
    F: Fn() -> Fut,
    Fut: std::future::Future<Output = Result<T, E>>,
    E: std::error::Error + Send + Sync + 'static,
{
    let mut delay = config.initial_delay;
    let mut last_error: Option<anyhow::Error> = None;

    for attempt in 1..=config.max_attempts {
        match operation().await {
            Ok(result) => return Ok(result),
            Err(e) => {
                last_error = Some(anyhow::anyhow!("{}", e));
                if attempt < config.max_attempts {
                    sleep(delay).await;
                    delay = std::cmp::min(
                        Duration::from_millis(
                            (delay.as_millis() as f64 * config.backoff_multiplier) as u64,
                        ),
                        config.max_delay,
                    );
                }
            }
        }
    }

    Err(anyhow::anyhow!(
        "Operation failed after {} attempts: {}",
        config.max_attempts,
        last_error.unwrap_or_else(|| anyhow::anyhow!("Unknown error"))
    ))
}

/// Circuit breaker state
#[derive(Clone, Debug, PartialEq)]
pub enum CircuitState {
    Closed,
    Open,
    HalfOpen,
}

/// Circuit breaker for failing operations
pub struct CircuitBreaker {
    state: CircuitState,
    failure_count: u32,
    failure_threshold: u32,
    success_threshold: u32,
    timeout: Duration,
    last_failure_time: Option<std::time::Instant>,
}

impl CircuitBreaker {
    pub fn new(failure_threshold: u32, success_threshold: u32, timeout: Duration) -> Self {
        Self {
            state: CircuitState::Closed,
            failure_count: 0,
            failure_threshold,
            success_threshold,
            timeout,
            last_failure_time: None,
        }
    }

    pub async fn execute<F, Fut, T, E>(&mut self, operation: F) -> Result<T>
    where
        F: FnOnce() -> Fut,
        Fut: std::future::Future<Output = Result<T, E>>,
        E: std::error::Error + Send + Sync + 'static,
    {
        // Check if circuit is open and timeout has passed
        if self.state == CircuitState::Open {
            if let Some(last_failure) = self.last_failure_time {
                if last_failure.elapsed() < self.timeout {
                    return Err(anyhow::anyhow!("Circuit breaker is open"));
                }
            }
            self.state = CircuitState::HalfOpen;
        }

        match operation().await {
            Ok(result) => {
                self.on_success();
                Ok(result)
            }
            Err(e) => {
                self.on_failure();
                Err(anyhow::anyhow!("Operation failed: {}", e))
            }
        }
    }

    fn on_success(&mut self) {
        match self.state {
            CircuitState::HalfOpen => {
                self.failure_count = 0;
                self.state = CircuitState::Closed;
            }
            CircuitState::Closed => {
                self.failure_count = 0;
            }
            _ => {}
        }
    }

    fn on_failure(&mut self) {
        self.failure_count += 1;
        self.last_failure_time = Some(std::time::Instant::now());

        if self.failure_count >= self.failure_threshold {
            self.state = CircuitState::Open;
        }
    }

    pub fn state(&self) -> CircuitState {
        self.state.clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_retry_success() {
        let mut call_count = 0;
        let result = retry_with_backoff(RetryConfig::default(), || {
            call_count += 1;
            async move {
                if call_count < 2 {
                    Err::<(), anyhow::Error>(anyhow::anyhow!("Not yet"))
                } else {
                    Ok(())
                }
            }
        })
        .await;

        assert!(result.is_ok());
        assert_eq!(call_count, 2);
    }

    #[tokio::test]
    async fn test_retry_failure() {
        let result = retry_with_backoff(RetryConfig::default(), || async move {
            Err::<(), anyhow::Error>(anyhow::anyhow!("Always fails"))
        })
        .await;

        assert!(result.is_err());
    }

    #[test]
    fn test_circuit_breaker() {
        let mut breaker = CircuitBreaker::new(3, 2, Duration::from_secs(1));

        // Should be closed initially
        assert_eq!(breaker.state(), CircuitState::Closed);

        // Simulate failures
        breaker.on_failure();
        breaker.on_failure();
        breaker.on_failure();

        // Should be open now
        assert_eq!(breaker.state(), CircuitState::Open);
    }
}
