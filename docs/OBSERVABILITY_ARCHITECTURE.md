# SIGIL OS Observability Architecture

**Version:** 1.0
**Date:** 2026-10-17
**Status:** Design Document

---

## Overview

This document defines the observability architecture for SIGIL OS, including logging, monitoring, telemetry, analytics, and alerting.

---

## 1. Logging

### 1.1 Structured Logging

**Implementation:** Use `tracing` crate with `tracing-subscriber`

**Log Levels:**
- ERROR: Critical errors requiring immediate attention
- WARN: Warning conditions that should be investigated
- INFO: Informational messages about normal operation
- DEBUG: Detailed diagnostic information
- TRACE: Very detailed diagnostic information

**Log Format (JSON):**
```json
{
  "timestamp": "2026-10-17T10:00:00Z",
  "level": "INFO",
  "service": "sigil-os",
  "module": "model-fabric",
  "message": "Model loaded successfully",
  "context": {
    "model": "Qwen-7B",
    "duration_ms": 1250
  },
  "trace_id": "abc123",
  "span_id": "def456"
}
```

**Implementation Plan:**
1. Add `tracing` and `tracing-subscriber` to dependencies
2. Configure structured logging in main.rs
3. Add logging to all critical paths
4. Implement log rotation
5. Add log aggregation (Loki or CloudWatch)

### 1.2 Log Rotation

**Policy:**
- Keep logs for 30 days
- Rotate daily
- Compress logs older than 7 days
- Max log size: 100MB per file

---

## 2. Monitoring

### 2.1 Metrics Collection

**Implementation:** Use `prometheus` crate with `prometheus-client`

**Key Metrics:**

**System Metrics:**
- CPU usage (%)
- Memory usage (%)
- Disk usage (%)
- Network I/O (bytes/s)
- Open file descriptors

**Application Metrics:**
- Request rate (requests/s)
- Response time (p50, p95, p99)
- Error rate (errors/s)
- Active connections
- Queue depth

**Model Metrics:**
- Inference latency (ms)
- Token generation rate (tokens/s)
- Model load time (ms)
- Cache hit rate (%)

**Implementation Plan:**
1. Add `prometheus` to dependencies
2. Expose metrics endpoint at `/metrics`
3. Add instrumentation to all services
4. Set up Prometheus server
5. Create Grafana dashboards

### 2.2 Health Checks

**Endpoints:**
- `/health` - Basic health check
- `/health/ready` - Readiness check
- `/health/live` - Liveness check

**Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-10-17T10:00:00Z",
  "components": {
    "database": "healthy",
    "model": "healthy",
    "inference": "healthy",
    "memory": "healthy"
  }
}
```

---

## 3. Telemetry

### 3.1 Distributed Tracing

**Implementation:** Use `opentelemetry` crate

**Tracing Strategy:**
- Trace ID: Request-level correlation
- Span ID: Operation-level correlation
- Parent Span ID: Nested operation tracking

**Key Spans:**
- `inference_request` - Full inference operation
- `model_load` - Model loading
- `tokenization` - Tokenization
- `generation` - Token generation
- `detokenization` - Detokenization

**Implementation Plan:**
1. Add `opentelemetry` to dependencies
2. Configure Jaeger or Tempo as trace backend
3. Add spans to all operations
4. Implement trace propagation

### 3.2 Error Tracking

**Implementation:** Use `sentry` crate

**Error Context:**
- Stack trace
- Request ID
- User ID (if available)
- System state
- Environment variables (sanitized)

**Implementation Plan:**
1. Add `sentry` to dependencies
2. Configure Sentry DSN
3. Add error capturing to all error paths
4. Implement error grouping and deduplication

---

## 4. Analytics

### 4.1 Usage Analytics

**Metrics to Track:**
- Daily active users (DAU)
- Monthly active users (MAU)
- Feature usage rates
- Session duration
- Error rates by feature

**Implementation:**
- Use event-based analytics
- Track user interactions (anonymized)
- Aggregate daily
- Store in time-series database

### 4.2 Performance Analytics

**Metrics to Track:**
- Inference latency trends
- Model accuracy trends
- Resource utilization trends
- System throughput

**Implementation:**
- Aggregate from metrics
- Store in time-series database
- Create trend analysis dashboards

---

## 5. Alerting

### 5.1 Alert Rules

**Critical Alerts (PagerDuty):**
- Service down (health check failing)
- Error rate > 5%
- Response time p95 > 10s
- Disk usage > 90%
- Memory usage > 90%

**Warning Alerts (Email/Slack):**
- Error rate > 1%
- Response time p95 > 5s
- Disk usage > 80%
- Memory usage > 80%
- Cache hit rate < 70%

**Info Alerts (Email):**
- Deployment completed
- Health check degraded (not critical)
- Resource usage trending high

### 5.2 Alert Channels

**Channels:**
- PagerDuty (critical)
- Slack (warning)
- Email (all)
- SMS (critical only)

**Implementation:**
1. Configure Alertmanager
2. Define alert rules
3. Set up notification routes
4. Test alert delivery

---

## 6. Dashboards

### 6.1 System Dashboard

**Metrics:**
- CPU, memory, disk, network
- Request rate
- Error rate
- Response time
- Active connections

### 6.2 Application Dashboard

**Metrics:**
- Inference latency
- Token generation rate
- Model load time
- Cache hit rate
- Request queue depth

### 6.3 Business Dashboard

**Metrics:**
- DAU/MAU
- Feature usage
- Session duration
- Error rates by feature

---

## 7. Implementation Plan

### Phase 1: Foundation (Week 1)
- Add structured logging
- Configure log rotation
- Add basic metrics
- Implement health checks

### Phase 2: Tracing (Week 2)
- Add distributed tracing
- Configure Jaeger/Tempo
- Add error tracking (Sentry)
- Implement trace propagation

### Phase 3: Monitoring (Week 3)
- Set up Prometheus
- Create Grafana dashboards
- Configure Alertmanager
- Define alert rules

### Phase 4: Analytics (Week 4)
- Implement usage analytics
- Implement performance analytics
- Create business dashboards
- Set up alert channels

---

## 8. Technology Stack

**Logging:**
- `tracing` crate
- `tracing-subscriber`
- `tracing-appender`
- Loki (log aggregation)

**Metrics:**
- `prometheus` crate
- `prometheus-client`
- Prometheus server
- Grafana (dashboards)

**Tracing:**
- `opentelemetry` crate
- Jaeger or Tempo

**Error Tracking:**
- `sentry` crate
- Sentry cloud

**Alerting:**
- Alertmanager
- PagerDuty
- Slack webhook

---

## 9. Security Considerations

**Log Sanitization:**
- Remove secrets from logs
- Sanitize PII
- Hash user IDs
- Remove sensitive headers

**Metrics Security:**
- Don't expose internal metrics publicly
- Use authentication on metrics endpoint
- Rate limit metrics endpoint

**Alerting Security:**
- Use secure webhooks
- Validate alert signatures
- Don't include secrets in alerts

---

## 10. Cost Considerations

**Estimated Costs:**
- Loki: $0 (self-hosted) or $50/month (cloud)
- Prometheus: $0 (self-hosted) or $100/month (cloud)
- Grafana: $0 (self-hosted) or $50/month (cloud)
- Jaeger/Tempo: $0 (self-hosted) or $50/month (cloud)
- Sentry: $26/month (developer plan)
- PagerDuty: $29/month (basic plan)
- **Total:** $105-305/month (cloud) or $26-55/month (self-hosted + Sentry)

---

## 11. Next Steps

1. Add `tracing` dependencies to Cargo.toml
2. Configure structured logging in main.rs
3. Add logging to critical paths
4. Set up log aggregation
5. Implement metrics collection
6. Set up Prometheus and Grafana
7. Configure alerting
8. Test all observability components

---

**Document Owner:** DevOps Team
**Review Date:** 2026-10-24
