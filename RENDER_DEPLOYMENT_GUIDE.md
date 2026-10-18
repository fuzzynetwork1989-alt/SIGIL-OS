# Render Deployment Guide for SIGIL OS

## Prerequisites Completed ✅

- [x] Application builds successfully (cargo build --release)
- [x] Application runs locally on port 8080
- [x] Health endpoint working: `http://localhost:8080/health`
- [x] Dockerfile created and optimized
- [x] Application configured to read PORT environment variable
- [x] Deployment files created (render.yaml, Dockerfile, .dockerignore)

## Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended for easy repo connection)
4. Verify your email if required

## Step 2: Connect Your GitHub Repository

1. After signing in, click "New +" in the top right
2. Select "Web Service"
3. You'll see a list of your GitHub repositories
4. Find "SIGIL-OS" (or your repository name)
5. Click "Connect" next to it

## Step 3: Configure the Web Service

### Basic Settings

- **Name**: `sigil-os-api`
- **Region**: Oregon (or choose the region closest to you)
- **Branch**: `main` (or your default branch)

### Build & Deploy Settings

- **Environment**: Docker
- **Docker Context**: `.`
- **Dockerfile Path**: `Dockerfile`

### Advanced Settings (Optional)

- **Instance Type**: Free (default)
- **Instances**: 1 (default)

## Step 4: Add Environment Variables

In the "Environment" section, add these variables:

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `RUST_LOG` | `info` |

Click "Add Environment Variable" for each one.

## Step 5: Create the Service

1. Review all settings
2. Click "Create Web Service" at the bottom
3. Render will start building your Docker image
4. First deployment takes 5-10 minutes

## Step 6: Monitor Deployment

1. Watch the build logs in the Render dashboard
2. You'll see Docker build progress
3. Once built, it will start the container
4. Health checks will begin automatically

## Step 7: Access Your Application

Once deployment is complete:

1. Render will provide a URL like: `https://sigil-os-api.onrender.com`
2. Test the health endpoint:
   ```bash
   curl https://sigil-os-api.onrender.com/health
   ```
3. Test the chat endpoint:
   ```bash
   curl -X POST https://sigil-os-api.onrender.com/api/v1/chat \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello SIGIL OS"}'
   ```

## Step 8: Set Up Custom Domain (Optional)

1. In your service dashboard, click "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `api.sigil-os.com`)
4. Update your DNS records as instructed by Render
5. Render will automatically provision SSL certificates

## Step 9: Set Up CI/CD for Automatic Deployment

### Option A: Use Render's Auto-Deploy (Recommended)

Render automatically deploys when you push to the connected branch:
- Just push to `main` branch
- Render will rebuild and redeploy automatically

### Option B: Use GitHub Actions

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add these secrets:
   - `RENDER_AUTH_TOKEN`: Get from Render Account Settings → API Keys
   - `RENDER_SERVICE_ID`: Get from your Render service URL (the part after `/srv/`)

4. The workflow at `.github/workflows/deploy-render.yml` will now:
   - Run tests on every push
   - Build the application
   - Deploy to Render automatically

## Step 10: Monitor Your Application

### View Logs

1. Go to your service dashboard in Render
2. Click "Logs" tab
3. View real-time logs
4. Logs are retained for 7 days on free tier

### Health Checks

Render automatically checks `/health` endpoint every 30 seconds.

### Metrics

Free tier includes basic metrics:
- CPU usage
- Memory usage
- Request count
- Response time

## Important Notes About Free Tier

### Sleep Mode

- **Sleeps after**: 15 minutes of inactivity
- **Cold start time**: 5-10 seconds
- **Wakes on**: First HTTP request
- **Free hours**: 750 hours per month

### Database

- **Free Postgres**: Available but expires after 30 days
- **Recommendation**: Use SQLite for now (already configured)

### Bandwidth

- **Free bandwidth**: 100 GB per month
- **Overage**: $0.10 per GB

## Troubleshooting

### Build Fails

**Problem**: Docker build fails

**Solution**:
1. Check build logs in Render dashboard
2. Ensure all dependencies are in Cargo.toml
3. Verify Dockerfile syntax
4. Check for syntax errors in Rust code

### Health Check Fails

**Problem**: Health check fails repeatedly

**Solution**:
1. Ensure PORT environment variable is set to 8080
2. Check that application binds to 0.0.0.0 (not 127.0.0.1)
3. Verify /health endpoint exists and returns 200 OK
4. Check logs for application errors

### Application Won't Start

**Problem**: Container starts but immediately crashes

**Solution**:
1. Check logs for panic messages
2. Verify all environment variables are set
3. Ensure database files can be created (permissions)
4. Check memory limits (free tier: 512MB)

### Port Binding Issues

**Problem**: Application can't bind to port

**Solution**:
1. Ensure PORT environment variable is set
2. Application should read PORT from environment
3. Application should bind to 0.0.0.0 for cloud hosting

## Scaling and Upgrades

### When to Upgrade from Free Tier

Consider upgrading when:
- You need always-on (no sleep)
- You need more than 512MB RAM
- You need more than 750 hours/month
- You need a production database
- You need custom domains with SSL

### Upgrade Costs

- **Starter**: $7/month (512MB RAM, always-on)
- **Standard**: $25/month (2GB RAM, better performance)
- **Pro**: $90/month (8GB RAM, premium features)

## Testing Checklist

Before considering deployment complete:

- [ ] Health endpoint returns 200 OK
- [ ] Chat endpoint accepts POST requests
- [ ] Super Brain endpoint works
- [ ] CORS is configured correctly
- [ ] Logs show no errors
- [ ] Application survives restart
- [ ] Memory usage is stable
- [ ] Response times are acceptable

## Security Checklist

- [ ] No secrets in code or git history
- [ ] Environment variables used for sensitive data
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS configured appropriately
- [ ] Rate limiting considered (if needed)
- [ ] Input validation in place
- [ ] Error messages don't leak information

## Next Steps After Deployment

1. **Monitor for 24 hours** - Watch logs and metrics
2. **Set up alerts** - Configure Render alerts for errors
3. **Add monitoring** - Consider external monitoring (Sentry, etc.)
4. **Test with real users** - Get feedback on performance
5. **Plan for scaling** - Know when to upgrade
6. **Document the deployment** - Keep notes for future reference

## Rollback Plan

If something goes wrong:

1. **Immediate rollback**:
   - Go to Render dashboard
   - Click "Events" tab
   - Find previous successful deployment
   - Click "Rollback"

2. **Manual rollback**:
   - Revert the commit that caused issues
   - Push to main branch
   - Render will auto-deploy the rollback

3. **Emergency disable**:
   - Click "Suspend Service" in Render dashboard
   - Investigate the issue
   - Fix and redeploy

## Support Resources

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Status**: [status.render.com](https://status.render.com)
- **GitHub Issues**: [SIGIL OS Issues](https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues)
- **Render Support**: support@render.com

## Quick Reference

**Deploy URL**: https://sigil-os-api.onrender.com (after deployment)
**Health Check**: https://sigil-os-api.onrender.com/health
**Chat Endpoint**: https://sigil-os-api.onrender.com/api/v1/chat
**Logs**: Render Dashboard → Logs tab
**Metrics**: Render Dashboard → Metrics tab

---

**Last Updated**: 2026-10-18
**Deployment Status**: Ready to deploy
**Tested Locally**: ✅ Yes
