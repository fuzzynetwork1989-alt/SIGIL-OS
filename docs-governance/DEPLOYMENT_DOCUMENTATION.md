# NEXORA Omega Deployment Documentation

## Deployment Overview

NEXORA Omega uses a multi-cloud deployment strategy:
- **Vercel**: Web console (Next.js)
- **Railway**: Backend services (API, databases, cache)
- **GPU Infrastructure**: Model inference (vLLM/SGLang)

## Pre-Deployment Checklist

### Security
- [ ] All secrets are stored in environment variables
- [ ] No secrets are committed to repository
- [ ] SSL/TLS certificates are configured
- [ ] Firewall rules are configured
- [ ] Security scanning has passed

### Infrastructure
- [ ] Database backups are configured
- [ ] Monitoring and alerting are set up
- [ ] Log aggregation is configured
- [ ] CDN is configured for static assets
- [ ] Rate limiting is configured

### Application
- [ ] All tests pass
- [ ] Code review completed
- [ ] Migration scripts tested
- [ ] Rollback plan documented
- [ ] Feature flags configured

## Vercel Deployment

### Setup

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Link Project**
```bash
cd web-console
vercel link
```

4. **Configure Environment Variables**
```bash
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add JWT_SECRET production
```

### Deployment Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Deploy specific branch
vercel --prod --branch main
```

### Environment Variables

Required environment variables for Vercel:

```env
NEXT_PUBLIC_API_URL=https://api.nexora.omega
NEXT_PUBLIC_APP_URL=https://nexora.omega
NEXT_PUBLIC_WS_URL=wss://api.nexora.omega
NEXT_PUBLIC_AUTH_DOMAIN=auth.nexora.omega
NEXT_PUBLIC_AUTH_CLIENT_ID=nexora-web-console
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_VISION=true
NEXT_PUBLIC_ENABLE_CODE_EXECUTION=true
```

### Custom Domain

1. **Add custom domain in Vercel**
```bash
vercel domains add nexora.omega
```

2. **Configure DNS**
```
A @ 76.76.21.21
A www 76.76.21.21
```

3. **Verify SSL**
Vercel automatically provisions SSL certificates.

## Railway Deployment

### Setup

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Add Services**
```bash
# PostgreSQL
railway add postgresql

# Redis
railway add redis

# API Gateway
railway add
```

### Deployment Commands

```bash
# Deploy all services
railway up

# Deploy specific service
railway up --service api-gateway

# View logs
railway logs

# View service status
railway status
```

### Service Configuration

#### PostgreSQL Service
```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DB}
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

#### Redis Service
```yaml
redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes
  volumes:
    - redis_data:/data
```

#### API Gateway Service
```yaml
api-gateway:
  build: ../../cloud-control-plane/services/api-gateway
  environment:
    DATABASE_URL: ${DATABASE_URL}
    REDIS_URL: ${REDIS_URL}
    JWT_SECRET: ${JWT_SECRET}
    API_PORT: 3000
```

### Environment Variables

Required environment variables for Railway:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
API_PORT=3000
HUGGINGFACE_API_KEY=your-huggingface-api-key
MODEL_GATEWAY_URL=https://model-gateway.nexora.omega
```

## GPU Inference Deployment

### vLLM Deployment

#### Prerequisites
- NVIDIA GPU with 8GB+ VRAM
- CUDA 11.0+
- Docker with NVIDIA runtime

#### Deployment Steps

1. **Pull vLLM Docker Image**
```bash
docker pull vllm/vllm-openai:latest
```

2. **Run vLLM Server**
```bash
docker run --gpus all \
  -p 8000:8000 \
  -p 8001:8001 \
  --env HUGGING_FACE_API_KEY=${HUGGINGFACE_API_KEY} \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen3-30B-A3B-Instruct-2507 \
  --tensor-parallel-size 4 \
  --gpu-memory-utilization 0.9 \
  --max-model-len 262144
```

3. **Verify Deployment**
```bash
curl http://localhost:8000/health
```

### Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster with GPU nodes
- kubectl configured
- NVIDIA device plugin installed

#### Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexora-model-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nexora-model-server
  template:
    metadata:
      labels:
        app: nexora-model-server
    spec:
      containers:
      - name: vllm-server
        image: vllm/vllm-openai:latest
        resources:
          limits:
            nvidia.com/gpu: 4
            memory: "64Gi"
            cpu: "16"
        env:
        - name: MODEL_NAME
          value: "Qwen/Qwen3-30B-A3B-Instruct-2507"
        ports:
        - containerPort: 8000
```

#### Deploy to Kubernetes

```bash
kubectl apply -f infra-platform/gpu-inference/deployment-manifest.yaml
```

## Terraform Deployment

### Setup

1. **Install Terraform**
```bash
# Linux
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# macOS
brew install terraform
```

2. **Configure Providers**
```bash
cd infra-platform/terraform
terraform init
```

### Deployment Commands

```bash
# Plan deployment
terraform plan

# Apply deployment
terraform apply

# Destroy deployment
terraform destroy
```

### Outputs

After deployment, get the infrastructure URLs:

```bash
terraform output
```

## CI/CD Deployment

### GitHub Actions

The CI/CD pipeline automatically deploys on push to main branch:

```yaml
# .github/workflows/ci.yml
deploy-vercel:
  needs: [contract-validation, rust-build, typescript-build, security-scan, dependency-scan]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### Manual Deployment

```bash
# Trigger GitHub Actions workflow
gh workflow run ci.yml

# Monitor deployment
gh run watch
```

## Monitoring and Observability

### Application Monitoring

#### OpenTelemetry Setup

```typescript
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nexora-omega',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
})

provider.register()
```

#### Metrics Collection

```typescript
import { MeterProvider } from '@opentelemetry/sdk-metrics'

const meterProvider = new MeterProvider()
const meter = meterProvider.getMeter('nexora-omega')

const requestCounter = meter.createCounter('http_requests_total')
const responseTime = meter.createHistogram('http_response_time')
```

### Infrastructure Monitoring

#### Railway Monitoring

- Built-in metrics dashboard
- Log aggregation
- Error tracking
- Performance monitoring

#### Vercel Monitoring

- Real-time logs
- Analytics dashboard
- Error tracking
- Performance insights

#### GPU Monitoring

```bash
# Monitor GPU usage
nvidia-smi

# Monitor vLLM metrics
curl http://localhost:8001/metrics
```

### Alerting

#### Configure Alerts

```yaml
# Prometheus alerting rules
groups:
  - name: nexora_omega
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
```

## Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel list

# Rollback to specific deployment
vercel rollback <deployment-url>

# Rollback to previous deployment
vercel rollback
```

### Railway Rollback

```bash
# View deployment history
railway status

# Rollback to previous deployment
railway up --service api-gateway --branch <previous-branch>
```

### Database Rollback

```bash
# Restore from backup
psql -U nexora_user -d nexora_omega < backup.sql

# Rollback migration
pnpm migrate:rollback
```

## Disaster Recovery

### Backup Strategy

#### Database Backups

```bash
# Automated daily backups
0 2 * * * pg_dump -U nexora_user nexora_omega > /backups/nexora_omega_$(date +\%Y\%m\%d).sql

# Retention policy
find /backups -name "nexora_omega_*.sql" -mtime +30 -delete
```

#### Redis Backups

```bash
# Automated Redis backups
0 3 * * * redis-cli --rdb /backups/redis_$(date +\%Y\%m\%d).rdb
```

### Recovery Procedures

#### Database Recovery

```bash
# Stop application
docker-compose down

# Restore database
psql -U nexora_user -d nexora_omega < /backups/nexora_omega_20240101.sql

# Start application
docker-compose up -d
```

#### Application Recovery

```bash
# Restore from backup
git checkout <previous-commit>
git push origin main --force

# Trigger deployment
gh workflow run ci.yml
```

## Performance Optimization

### Vercel Optimization

- Enable Edge Network caching
- Configure CDN for static assets
- Optimize images
- Minify JavaScript/CSS

### Railway Optimization

- Use connection pooling
- Enable query caching
- Optimize database indexes
- Use Redis for session storage

### GPU Optimization

- Use tensor parallelism
- Optimize GPU memory usage
- Use quantization
- Batch requests

## Security Hardening

### Network Security

- Configure firewall rules
- Use VPN for admin access
- Enable DDoS protection
- Configure rate limiting

### Application Security

- Enable HTTPS everywhere
- Configure CORS properly
- Use security headers
- Implement input validation

### Infrastructure Security

- Use managed services
- Enable encryption at rest
- Rotate secrets regularly
- Use IAM roles

## Compliance

### Data Protection

- GDPR compliance
- Data retention policies
- Data export capabilities
- Right to be forgotten

### Auditing

- Enable audit logging
- Log all API calls
- Log authentication events
- Log data access

### Certifications

- SOC 2 Type II
- ISO 27001
- HIPAA (if applicable)
- PCI DSS (if applicable)

## Support and Maintenance

### Monitoring

- 24/7 monitoring
- Automated alerting
- On-call rotation
- Incident response

### Maintenance Windows

- Scheduled maintenance: Sunday 2-4 AM UTC
- Emergency maintenance: As needed
- Notification: 24 hours in advance

### Updates

- Security updates: Within 24 hours
- Feature updates: Monthly
- Dependency updates: Weekly

## Documentation Maintenance

- Keep deployment docs updated
- Document all changes
- Maintain runbooks
- Update diagrams

## Contact

- **Support**: support@nexora.omega
- **Emergency**: emergency@nexora.omega
- **Documentation**: docs.nexora.omega