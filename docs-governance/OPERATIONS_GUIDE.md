# NEXORA Omega Operations and Maintenance Guide

## Operations Overview

NEXORA Omega is a production-grade cognitive operating system requiring comprehensive operational procedures. This guide covers day-to-day operations, incident response, maintenance procedures, and performance optimization.

## Monitoring

### Application Monitoring

### Key Metrics

#### Cognitive Process Metrics
- Active processes count
- Process completion rate
- Average process duration
- Process failure rate
- Memory usage per process

#### Model Gateway Metrics
- Request rate
- Response time (p50, p95, p99)
- Token usage
- Cost per request
- Model availability

#### Memory Fabric Metrics
- Memory storage size
- Retrieval latency
- Index freshness
- Query success rate

### Monitoring Tools

#### OpenTelemetry Setup

```typescript
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'

const exporter = new PrometheusExporter({
  port: 9464,
})

const provider = new NodeTracerProvider()
provider.addSpanProcessor(new BatchSpanProcessor(exporter))
provider.register()
```

#### Dashboard Configuration

**Grafana Dashboard Panels**:

1. **System Health**
   - CPU usage
   - Memory usage
   - Disk usage
   - Network I/O

2. **Application Performance**
   - Request rate
   - Response time
   - Error rate
   - Throughput

3. **Cognitive Processes**
   - Active processes
   - Process states
   - Completion rate
   - Failure rate

4. **Model Gateway**
   - Request rate
   - Response time
   - Token usage
   - Cost tracking

### Alerting

#### Alert Rules

```yaml
# Prometheus alert rules
groups:
  - name: nexora_omega
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_response_time) > 1
        for: 5m
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"

      - alert: ProcessFailureRate
        expr: rate(cognitive_process_failures[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High cognitive process failure rate"
          description: "Process failure rate is {{ $value }}"
```

#### Alert Channels

- **Email**: ops@nexora.omega
- **Slack**: #nexora-operations
- **PagerDuty**: On-call rotation
- **SMS**: Critical alerts only

## Incident Response

### Incident Severity Levels

#### P0 - Critical
- System outage affecting all users
- Data loss or corruption
- Security breach
- SLA violation

#### P1 - High
- Major functionality broken
- Performance degradation affecting many users
- Data inconsistency

#### P2 - Medium
- Minor functionality broken
- Performance degradation affecting some users
- Non-critical bugs

#### P3 - Low
- Cosmetic issues
- Documentation errors
- Minor improvements

### Incident Response Procedure

#### 1. Detection
- Automated alert triggers
- User reports
- Monitoring dashboard anomalies

#### 2. Acknowledgment
- Acknowledge alert in monitoring system
- Assign severity level
- Notify on-call engineer

#### 3. Investigation
- Gather logs and metrics
- Reproduce issue if possible
- Identify root cause
- Assess impact

#### 4. Mitigation
- Implement temporary fix
- Restore service if possible
- Communicate with stakeholders
- Update status page

#### 5. Resolution
- Implement permanent fix
- Verify fix works
- Deploy to production
- Monitor for recurrence

#### 6. Post-Incident
- Write postmortem
- Update runbooks
- Implement preventive measures
- Schedule follow-up review

### Post-Incident Template

```markdown
# Post-Incident Report

## Summary
[Brief description of the incident]

## Impact
- Users affected: [number]
- Duration: [time]
- Services affected: [list]

## Timeline
- [Time]: Incident detected
- [Time]: Incident acknowledged
- [Time]: Mitigation implemented
- [Time]: Resolution implemented
- [Time]: Service restored

## Root Cause
[What caused the incident]

## Resolution
[How it was fixed]

## Lessons Learned
[What can be improved]

## Action Items
- [ ] [Action item 1]
- [ ] [Action item 2]
```

## Maintenance Procedures

### Daily Maintenance

#### Health Checks
```bash
# Check all services
curl https://api.nexora.omega/health
curl https://nexora.omega/health

# Check database connectivity
psql -U nexora_user -d nexora_omega -c "SELECT 1;"

# Check Redis connectivity
redis-cli ping
```

#### Log Review
```bash
# Check error logs
docker-compose logs --tail=100 api-gateway | grep ERROR

# Check application logs
docker-compose logs --tail=100 cognitive-kernel
```

#### Metrics Review
- Check dashboards for anomalies
- Review key performance indicators
- Verify alert thresholds

### Weekly Maintenance

#### Database Maintenance
```bash
# Analyze database performance
psql -U nexora_user -d nexora_omega -c "ANALYZE;"

# Vacuum database
psql -U nexora_user -d nexora_omega -c "VACUUM ANALYZE;"

# Check table sizes
psql -U nexora_user -d nexora_omega -c "
  SELECT schemaname, tablename,
         pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
  FROM pg_tables
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

#### Redis Maintenance
```bash
# Check Redis memory usage
redis-cli INFO memory

# Check Redis keyspace
redis-cli INFO keyspace

# Clean up expired keys
redis-cli --scan --pattern '*:expired:*' | xargs redis-cli DEL
```

#### Log Rotation
```bash
# Rotate application logs
logrotate /etc/logrotate.d/nexora-omega

# Archive old logs
find /var/log/nexora-omega -name "*.log" -mtime +30 -exec gzip {} \;
```

### Monthly Maintenance

#### Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update dependencies
pnpm update
cd platform-core
cargo update

# Security scan
pnpm audit
cargo audit
```

#### Performance Review
- Analyze performance trends
- Review capacity planning
- Update forecasting models
- Adjust resource allocation

#### Backup Verification
```bash
# Test database restore
pg_restore --clean -U nexora_user -d nexora_omega_test backup.sql

# Test Redis restore
redis-cli --rdb backup.rdb

# Verify backup integrity
sha256sum backup.sql
```

## Performance Optimization

### Database Optimization

#### Index Optimization
```sql
-- Identify missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;

-- Create indexes
CREATE INDEX idx_cognitive_processes_state ON cognitive_processes(state);
CREATE INDEX idx_memories_type ON memories(type);
CREATE INDEX idx_capabilities_principal ON capabilities(principal);
```

#### Query Optimization
```sql
-- Analyze slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Optimize queries
EXPLAIN ANALYZE SELECT * FROM cognitive_processes WHERE state = 'running';
```

### Application Optimization

#### Caching Strategy
```typescript
// Redis caching
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
})

async function getCachedData(key: string) {
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  return null
}

async function setCachedData(key: string, data: any, ttl: number = 3600) {
  await redis.setex(key, ttl, JSON.stringify(data))
}
```

#### Connection Pooling
```typescript
// Database connection pool
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

### Infrastructure Optimization

#### Auto-scaling Configuration
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### Load Balancing
```yaml
# Nginx configuration
upstream api_gateway {
  least_conn;
  server api-gateway-1:3000;
  server api-gateway-2:3000;
  server api-gateway-3:3000;
}

server {
  listen 80;
  server_name api.nexora.omega;

  location / {
    proxy_pass http://api_gateway;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## Security Operations

### Security Monitoring

#### Intrusion Detection
```bash
# Monitor failed login attempts
tail -f /var/log/auth.log | grep "Failed password"

# Monitor suspicious API calls
grep "UNAUTHORIZED" /var/log/nexora-omega/api.log
```

#### Vulnerability Scanning
```bash
# Run Trivy scan
trivy image nexora-omega/api-gateway:latest

# Run Snyk scan
snyk test

# Run npm audit
pnpm audit
```

### Security Patching

#### Emergency Patching
1. Identify vulnerability
2. Assess impact
3. Test patch in staging
4. Deploy to production
5. Verify fix
6. Monitor for issues

#### Regular Patching
- Monthly security updates
- Quarterly dependency updates
- Annual security review

## Backup and Recovery

### Backup Strategy

#### Database Backups
```bash
# Daily full backup
0 2 * * * pg_dump -U nexora_user nexora_omega > /backups/daily/nexora_omega_$(date +\%Y\%m\%d).sql

# Hourly incremental backup
0 * * * * pg_dump -U nexora_user --section=data nexora_omega > /backups/hourly/nexora_omega_$(date +\%Y\%m\%d_\%H).sql
```

#### Redis Backups
```bash
# Daily Redis backup
0 3 * * * redis-cli --rdb /backups/redis/nexora_omega_$(date +\%Y\%m\%d).rdb
```

#### Application Backups
```bash
# Backup configuration files
tar -czf /backups/config/nexora_omega_$(date +\%Y\%m\%d).tar.gz /etc/nexora-omega

# Backup logs
tar -czf /backups/logs/nexora_omega_$(date +\%Y\%m\%d).tar.gz /var/log/nexora-omega
```

### Recovery Procedures

#### Database Recovery
```bash
# Stop application
docker-compose down

# Restore database
psql -U nexora_user -d nexora_omega < /backups/daily/nexora_omega_20240101.sql

# Start application
docker-compose up -d
```

#### Point-in-Time Recovery
```bash
# Recover to specific point in time
pg_restore -U nexora_user -d nexora_omega --single-transaction /backups/base_backup.sql
psql -U nexora_user -d nexora_omega -f /backups/wal/2024-01-01-14-00-00.sql
```

## Capacity Planning

### Capacity Metrics

#### Current Capacity
- CPU utilization: 60%
- Memory utilization: 70%
- Disk utilization: 40%
- Network utilization: 30%

#### Growth Projections
- User growth: 20% per month
- Data growth: 15% per month
- Request growth: 25% per month

### Scaling Strategy

#### Horizontal Scaling
- Add more application servers
- Use load balancer
- Implement auto-scaling

#### Vertical Scaling
- Increase server resources
- Optimize database
- Use caching

#### Database Scaling
- Read replicas
- Sharding
- Partitioning

## Disaster Recovery

### Disaster Recovery Plan

#### Recovery Time Objective (RTO)
- Critical services: 1 hour
- Important services: 4 hours
- Non-critical services: 24 hours

#### Recovery Point Objective (RPO)
- Critical data: 15 minutes
- Important data: 1 hour
- Non-critical data: 24 hours

### Disaster Recovery Procedures

#### 1. Assess Impact
- Determine affected services
- Estimate data loss
- Communicate with stakeholders

#### 2. Activate DR Plan
- Activate backup systems
- Switch to backup infrastructure
- Notify users

#### 3. Restore Services
- Restore from backups
- Verify data integrity
- Test functionality

#### 4. Normal Operations
- Switch back to primary systems
- Monitor for issues
- Update documentation

## Compliance

### Regulatory Compliance

#### GDPR Compliance
- Data protection measures
- User consent management
- Data export capabilities
- Right to be forgotten

#### SOC 2 Compliance
- Security controls
- Access controls
- Monitoring and logging
- Incident response

### Audit Procedures

#### Security Audits
- Quarterly security reviews
- Annual penetration testing
- Continuous vulnerability scanning

#### Compliance Audits
- Annual compliance review
- Documentation verification
- Control testing

## Documentation

### Runbook Maintenance

#### Update Schedule
- Daily: Update operational procedures
- Weekly: Update troubleshooting guides
- Monthly: Update architecture documentation

#### Documentation Standards
- Use clear, concise language
- Include code examples
- Maintain version control
- Review regularly

### Knowledge Base

#### Internal Documentation
- Architecture diagrams
- API documentation
- Configuration guides
- Troubleshooting guides

#### External Documentation
- User guides
- API documentation
- Integration guides
- Support documentation

## Training

### Operator Training

#### New Operator Training
- System overview
- Monitoring tools
- Incident response
- Maintenance procedures

#### Ongoing Training
- Monthly training sessions
- Quarterly drills
- Annual certification

### Documentation Training

#### Documentation Standards
- Use consistent formatting
- Include examples
- Keep up to date
- Review regularly

## Support

### Support Tiers

#### Tier 1 - Basic Support
- User guidance
- Basic troubleshooting
- Issue escalation

#### Tier 2 - Advanced Support
- Complex troubleshooting
- System configuration
- Performance optimization

#### Tier 3 - Expert Support
- Critical issues
- System architecture
- Development support

### Support Procedures

#### Issue Escalation
1. Triage issue
2. Assign to appropriate tier
3. Set response SLA
4. Monitor progress
5. Verify resolution

#### SLA Targets
- P0: 15 minutes response, 1 hour resolution
- P1: 1 hour response, 4 hours resolution
- P2: 4 hours response, 24 hours resolution
- P3: 24 hours response, 72 hours resolution

## Contact Information

### Operations Team
- **Email**: ops@nexora.omega
- **Slack**: #nexora-operations
- **Phone**: +1-555-OPERATIONS

### Emergency Contacts
- **On-call**: +1-555-ONCALL
- **CTO**: +1-555-CTO
- **CEO**: +1-555-CEO

### External Support
- **Railway**: support@railway.app
- **Vercel**: support@vercel.com
- **GitHub**: support@github.com