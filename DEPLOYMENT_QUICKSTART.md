# Deployment Quick Start

Get SIGIL OS online in 5 minutes with these steps.

## Option 1: Render (Recommended - Easiest)

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Add deployment configuration"
git push origin main

# 2. Go to render.com and sign up with GitHub
# 3. Click "New" → "Web Service"
# 4. Connect your GitHub repository
# 5. Select branch: main
# 6. Settings:
#    - Name: sigil-os-api
#    - Environment: Docker
#    - Docker Context: .
#    - Dockerfile: Dockerfile
#    - Plan: Free
# 7. Add environment variables:
#    - PORT=8080
#    - RUST_LOG=info
# 8. Click "Create Web Service"
# 9. Wait 5-10 minutes for deployment
# 10. Access at: https://sigil-os-api.onrender.com/health
```

## Option 2: Belmo (Best for Always-On)

```bash
# 1. Go to belmo.io and sign up with GitHub
# 2. Install Belmo GitHub App on your repository
# 3. In Belmo Dashboard:
#    - Click "New Deployment"
#    - Select your repository
#    - Select branch: main
#    - Belmo auto-detects Cargo.toml
# 4. Click "Deploy"
# 5. Wait 2-4 minutes for first build
# 6. Access at: https://your-app.belmo.io/health
```

## Option 3: RustAPI Cloud (Best for APIs)

```bash
# 1. Build release binary
cargo build --release --bin api

# 2. Go to rustapi.cloud and sign up
# 3. Install RustAPI CLI
cargo install rustapi-cli

# 4. Login
cargo rustapi login

# 5. Deploy
cargo rustapi deploy cloud

# 6. Access at: https://your-app.rustapi.cloud/health
```

## Option 4: Docker (Most Flexible)

```bash
# 1. Build Docker image
docker build -t sigil-os:latest .

# 2. Test locally
docker run -p 8080:8080 -e PORT=8080 sigil-os:latest

# 3. Push to Docker Hub
docker tag sigil-os:latest yourusername/sigil-os:latest
docker login
docker push yourusername/sigil-os:latest

# 4. Deploy to any platform (Fly.io, Railway, etc.)
```

## What We Created

- ✅ `Dockerfile` - Multi-stage Docker build for small, fast images
- ✅ `.dockerignore` - Excludes unnecessary files from Docker build
- ✅ `render.yaml` - Render deployment blueprint
- ✅ `belmo.toml` - Belmo configuration
- ✅ `rustapi-config.toml` - RustAPI Cloud configuration
- ✅ `.github/workflows/deploy-render.yml` - Render CI/CD
- ✅ `.github/workflows/deploy-belmo.yml` - Belmo CI/CD
- ✅ `.github/workflows/docker-build.yml` - Docker CI/CD with security scanning
- ✅ `DEPLOYMENT.md` - Comprehensive deployment guide
- ✅ `.env.example` - Environment variable template
- ✅ Modified `main.rs` - Supports PORT environment variable for cloud hosting
- ✅ Modified `http.rs` - Better logging for deployment

## Testing Your Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app-url.com/health

# Chat endpoint
curl -X POST https://your-app-url.com/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello SIGIL OS"}'

# Super Brain endpoint
curl -X POST https://your-app-url.com/api/v1/superbrain/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "conversation_id": "test", "user_id": "test"}'
```

## Which Platform Should You Choose?

| Use Case | Recommended Platform |
|----------|---------------------|
| **Easiest setup** | Render |
| **Always-on (no sleep)** | Belmo |
| **API-focused** | RustAPI Cloud |
| **Full control** | Docker + any platform |
| **Free database** | Render (30 days) |

## Common Issues

**Port binding error?**
- Ensure your platform sets the `PORT` environment variable
- The app now reads `PORT` from environment

**Build taking too long?**
- First build is always slower (5-10 min)
- Subsequent builds are faster with caching

**App sleeping?**
- Render and RustAPI Cloud sleep when idle
- Use a health check cron job to keep it warm
- Upgrade to paid plan for always-on

## Next Steps

1. Choose a platform and deploy
2. Test all endpoints
3. Set up custom domain (optional)
4. Configure CI/CD automation
5. Set up monitoring and alerts

## Need Help?

- See `DEPLOYMENT.md` for detailed guides
- Check platform documentation
- Open a GitHub issue
