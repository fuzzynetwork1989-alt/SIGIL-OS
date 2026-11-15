#!/bin/bash

# NEXORA Omega Infrastructure Deployment Script
# Automates deployment to Railway, Vercel, and GPU infrastructure

set -e

echo "🚀 NEXORA Omega Infrastructure Deployment"
echo "=========================================="

# Check required environment variables
if [ -z "$RAILWAY_TOKEN" ]; then
  echo "❌ RAILWAY_TOKEN environment variable is required"
  exit 1
fi

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN environment variable is required"
  exit 1
fi

# Validate environment
if [ -z "$ENVIRONMENT" ]; then
  ENVIRONMENT="production"
  echo "⚠️  ENVIRONMENT not set, defaulting to: $ENVIRONMENT"
fi

echo "📋 Deployment Configuration:"
echo "   Environment: $ENVIRONMENT"
echo "   Project: nexora-omega"
echo ""

# Step 1: Deploy Railway infrastructure
echo "🚂 Deploying Railway infrastructure..."
cd infra-platform/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan
echo "✅ Railway infrastructure deployed"

# Get infrastructure outputs
RAILWAY_URL=$(terraform output -raw railway_project_url)
POSTGRES_URL=$(terraform output -raw postgres_url)
REDIS_URL=$(terraform output -raw redis_url)
API_GATEWAY_URL=$(terraform output -raw api_gateway_url)

echo "📡 Railway URLs:"
echo "   Project: $RAILWAY_URL"
echo "   API Gateway: $API_GATEWAY_URL"
echo ""

# Step 2: Configure Vercel deployment
echo "🌐 Configuring Vercel deployment..."
cd ../vercel
vercel link --yes
vercel env add NEXT_PUBLIC_API_URL $ENVIRONMENT --value=$API_GATEWAY_URL
vercel env add NEXT_PUBLIC_APP_URL $ENVIRONMENT --value=https://nexora.omega
echo "✅ Vercel environment configured"

# Step 3: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --token=$VERCEL_TOKEN
echo "✅ Vercel deployment complete"

# Step 4: Deploy GPU inference (if enabled)
if [ "$ENABLE_GPU_INFERENCE" = "true" ]; then
  echo "🖥️  Deploying GPU inference..."
  cd ../gpu-inference

  # Build and push Docker image
  docker build -t nexora-omega/vllm-server:latest .
  docker push nexora-omega/vllm-server:latest

  # Apply Kubernetes manifest
  kubectl apply -f deployment-manifest.yaml
  echo "✅ GPU inference deployed"
else
  echo "⏭️  GPU inference deployment skipped (ENABLE_GPU_INFERENCE=false)"
fi

# Step 5: Health checks
echo "🏥 Running health checks..."
sleep 30

# Check Railway services
echo "Checking Railway services..."
curl -f $API_GATEWAY_URL/health || echo "⚠️  API Gateway health check failed"

# Check Vercel deployment
echo "Checking Vercel deployment..."
curl -f https://nexora.omega/health || echo "⚠️  Web console health check failed"

# Check GPU inference (if deployed)
if [ "$ENABLE_GPU_INFERENCE" = "true" ]; then
  echo "Checking GPU inference..."
  kubectl get pods -n nexora-production -l app=nexora-model-server
fi

echo ""
echo "🎉 Deployment Complete!"
echo "=========================================="
echo "📊 Infrastructure URLs:"
echo "   Railway: $RAILWAY_URL"
echo "   API Gateway: $API_GATEWAY_URL"
echo "   Web Console: https://nexora.omega"
echo ""
echo "🔧 Next Steps:"
echo "   1. Configure DNS records for nexora.omega"
echo "   2. Set up monitoring and alerting"
echo "   3. Configure SSL certificates"
echo "   4. Run smoke tests"
echo "   5. Configure canary deployment"
echo ""
echo "📖 For rollback, run: ./rollback.sh"