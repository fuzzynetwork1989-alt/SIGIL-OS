# SIGIL OS Deployment Guide

This guide explains how to deploy SIGIL OS to various free hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Platform Comparison](#platform-comparison)
- [Render Deployment](#render-deployment)
- [Belmo Deployment](#belmo-deployment)
- [RustAPI Cloud Deployment](#rustapi-cloud-deployment)
- [Docker Deployment](#docker-deployment)
- [Local Testing](#local-testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- [x] A GitHub repository with SIGIL OS code
- [x] Rust toolchain installed (1.70+)
- [x] Docker installed (for container-based deployment)
- [x] An account on your chosen hosting platform

## Platform Comparison

| Platform | Free Tier | Sleep/Idle | Rust Support | Best For |
|----------|-----------|------------|--------------|----------|
| **Render** | 750 hours/month | Yes (15 min) | Native | Production-ready, reliable |
| **Belmo** | 1 service 24/7 | No (always-on) | Specialized | Always-on Rust apps |
| **RustAPI Cloud** | 3 deploys | Yes (scale-to-zero) | Rust-only | API-focused deployments |
| **Oracle Cloud** | 2 OCPUs + 12GB RAM | No | Full VPS | Complete control |

## Render Deployment

Render is recommended for most users due to its reliability and native Rust support.

### Quick Start

1. **Create a Render account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect your repository**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select the branch (usually `main` or `master`)

3. **Configure the service**
   - Name: `sigil-os-api`
   - Environment: Docker
   - Region: Oregon (or closest to you)
   - Plan: Free
   - Docker Context: `.`
   - Dockerfile Path: `Dockerfile`

4. **Set environment variables**
   ```
   PORT=8080
   RUST_LOG=info
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your Docker image
   - First deployment takes 5-10 minutes

6. **Access your app**
   - Render provides a URL like `https://sigil-os-api.onrender.com`
   - Test the health endpoint: `https://sigil-os-api.onrender.com/health`

### Using Render Blueprint

You can also deploy using the `render.yaml` blueprint file:

```bash
# Install Render CLI
npm install -g @renderinc/cli

# Login
render login

# Deploy
render-blueprint apply
```

### GitHub Actions Automation

1. Add secrets to your GitHub repository:
   - `RENDER_AUTH_TOKEN`: Get from Render account settings
   - `RENDER_SERVICE_ID`: Get from your Render service URL

2. The workflow at `.github/workflows/deploy-render.yml` will automatically deploy on push to main.

### Important Notes

- **Free tier spins down** after 15 minutes of inactivity
- **Cold start time**: ~5-10 seconds
- **Database**: Free Postgres expires after 30 days
- **Custom domains**: Supported on free tier

## Belmo Deployment

Belmo is specialized for Rust and offers always-on free hosting.

### Quick Start

1. **Create a Belmo account**
   - Visit [belmo.io](https://belmo.io)
   - Sign up with GitHub

2. **Install Belmo GitHub App**
   - Go to Belmo Dashboard
   - Install the GitHub App on your repository

3. **Configure deployment**
   - Belmo auto-detects your `Cargo.toml`
   - It uses the `belmo.toml` configuration file
   - Select the branch and click "Deploy"

4. **Access your app**
   - Belmo provides a URL like `https://your-app.belmo.io`
   - Test the health endpoint: `https://your-app.belmo.io/health`

### Using Belmo CLI

```bash
# Install Belmo CLI
curl -fsSL https://cli.belmo.io/install.sh | sh

# Login
belmo login

# Deploy
belmo deploy
```

### Important Notes

- **Always-on**: No sleep on free tier
- **Specialized for Rust**: Optimized builds
- **Auto-detection**: No Dockerfile needed
- **Limited features**: Newer platform, fewer integrations

## RustAPI Cloud Deployment

RustAPI Cloud is designed specifically for Rust APIs.

### Quick Start

1. **Create a RustAPI Cloud account**
   - Visit [rustapi.cloud](https://rustapi.cloud)
   - Sign up with email or GitHub OAuth

2. **Build your application**
   ```bash
   cargo build --release --bin api
   ```

3. **Deploy**
   ```bash
   # Install RustAPI CLI
   cargo install rustapi-cli

   # Login
   cargo rustapi login

   # Deploy
   cargo rustapi deploy cloud
   ```

4. **Access your app**
   - RustAPI provides a URL like `https://your-app.rustapi.cloud`
   - Test the health endpoint: `https://your-app.rustapi.cloud/health`

### Important Notes

- **Scale-to-zero**: Sleeps when idle
- **API-focused**: Optimized for REST APIs
- **Binary deployment**: Upload compiled binary
- **Size limit**: 25MB on free tier

## Docker Deployment

Deploy with Docker to any platform that supports containers.

### Build the image

```bash
# Build the Docker image
docker build -t sigil-os:latest .

# Run locally
docker run -p 8080:8080 -e PORT=8080 sigil-os:latest
```

### Push to Docker Hub

```bash
# Tag the image
docker tag sigil-os:latest yourusername/sigil-os:latest

# Login to Docker Hub
docker login

# Push the image
docker push yourusername/sigil-os:latest
```

### Deploy to any platform

Once your image is on Docker Hub, you can deploy to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Fly.io
- Railway
- And many more

### GitHub Actions Automation

The workflow at `.github/workflows/docker-build.yml` will:
- Build and push Docker images on push
- Tag images with branch, commit SHA, and version
- Run security scans with Trivy
- Upload results to GitHub Security

Add these secrets to your GitHub repository:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

## Local Testing

Before deploying, test locally:

```bash
# Build the application
cargo build --release --bin api

# Run with custom port
PORT=8080 ./target/release/api

# Test health endpoint
curl http://localhost:8080/health

# Test chat endpoint
curl -X POST http://localhost:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello SIGIL OS"}'
```

### Test with Docker

```bash
# Build Docker image
docker build -t sigil-os:test .

# Run container
docker run -p 8080:8080 -e PORT=8080 sigil-os:test

# Test in another terminal
curl http://localhost:8080/health
```

## Troubleshooting

### Port binding issues

**Problem**: Application won't start due to port already in use.

**Solution**: The application now uses the `PORT` environment variable. Ensure your hosting platform sets this correctly, or use a different port.

### Build failures

**Problem**: Docker build fails with Rust compilation errors.

**Solution**:
1. Ensure Rust version is 1.70+
2. Check that all dependencies are in `Cargo.toml`
3. Run `cargo test` locally first
4. Check build logs for specific errors

### Sleep/cold start issues

**Problem**: Application takes too long to wake up from sleep.

**Solution**:
- Consider upgrading to a paid plan for always-on
- Use health checks to keep the app warm
- Implement caching to reduce cold start impact

### Memory limits

**Problem**: Application crashes due to out of memory.

**Solution**:
- Free tiers typically have 256-512MB RAM
- Optimize memory usage in your code
- Consider upgrading to a paid plan with more memory

### Database connection issues

**Problem**: Application can't connect to database.

**Solution**:
- Ensure database URL is set in environment variables
- Check that database is in the same region as your app
- Verify database is not expired (Render free Postgres expires after 30 days)

## Environment Variables

Common environment variables for SIGIL OS:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to bind to | `8080` |
| `RUST_LOG` | Log level | `info` |
| `DATABASE_URL` | Database connection string | (optional) |
| `SUPERBRAIN_ENABLED` | Enable Super Brain features | `true` |

## Monitoring and Logs

### Render
- View logs in Render Dashboard
- Log retention: 7 days on free tier
- Metrics available in dashboard

### Belmo
- View logs in Belmo Dashboard
- Real-time log streaming

### RustAPI Cloud
- Built-in metrics (traffic, latency, CPU, memory)
- Health probes tracked automatically

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** (automatic on most platforms)
4. **Regular updates** to dependencies
5. **Scan for vulnerabilities** (Trivy included in Docker workflow)

## Cost Comparison

| Platform | Free Tier | Paid Starting | When to Upgrade |
|----------|-----------|---------------|-----------------|
| Render | 750 hours/month | $7/month | Production, always-on |
| Belmo | 1 service 24/7 | Contact sales | Multiple services |
| RustAPI Cloud | 3 deploys | $5/month | More deploys, larger binaries |
| Oracle Cloud | 2 OCPUs + 12GB RAM | Pay-as-you-go | More resources |

## Next Steps

1. Choose a platform based on your needs
2. Follow the quick start guide for that platform
3. Test the deployment
4. Set up monitoring and alerts
5. Configure custom domain (optional)
6. Set up CI/CD automation

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Belmo Docs**: [belmo.io/docs](https://belmo.io/docs)
- **RustAPI Cloud**: [rustapi.cloud/docs](https://rustapi.cloud/docs)
- **GitHub Issues**: [SIGIL OS Issues](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues)
