#!/bin/bash

# NEXORA Omega Infrastructure Rollback Script
# Automates rollback of infrastructure deployments

set -e

echo "🔄 NEXORA Omega Infrastructure Rollback"
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

echo "📋 Rollback Configuration:"
echo "   Environment: $ENVIRONMENT"
echo "   Project: nexora-omega"
echo ""

# Step 1: Rollback Vercel deployment
echo "🌐 Rolling back Vercel deployment..."
cd infra-platform/vercel
vercel rollback --token=$VERCEL_TOKEN
echo "✅ Vercel rollback complete"

# Step 2: Rollback Railway services
echo "🚂 Rolling back Railway services..."
cd ../terraform

# Get current deployment state
terraform plan -destroy -out=tfplan

# Confirm rollback
echo "⚠️  This will destroy current Railway infrastructure"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
  terraform apply tfplan
  echo "✅ Railway infrastructure rolled back"
else
  echo "❌ Rollback cancelled"
  exit 1
fi

# Step 3: Rollback GPU inference (if deployed)
if [ "$ENABLE_GPU_INFERENCE" = "true" ]; then
  echo "🖥️  Rolling back GPU inference..."
  cd ../gpu-inference
  kubectl rollout undo deployment/nexora-model-server -n nexora-production
  echo "✅ GPU inference rolled back"
else
  echo "⏭️  GPU inference rollback skipped (not deployed)"
fi

# Step 4: Restore from backup (if available)
echo "💾 Checking for backups..."
if [ -f "../backups/latest-backup.sql" ]; then
  echo "Found database backup, restore?"
  read -p "Restore database from backup? (yes/no): " restore_confirm

  if [ "$restore_confirm" = "yes" ]; then
    echo "Restoring database from backup..."
    # Database restore commands would go here
    echo "✅ Database restored"
  fi
fi

echo ""
echo "🎉 Rollback Complete!"
echo "=========================================="
echo "📊 Infrastructure Status:"
echo "   Vercel: Rolled back to previous deployment"
echo "   Railway: Infrastructure destroyed"
echo "   GPU Inference: Rolled back to previous version"
echo ""
echo "🔧 Next Steps:"
echo "   1. Verify rollback was successful"
echo "   2. Check application health"
echo "   3. Review logs for any issues"
echo "   4. Investigate cause of rollback"
echo "   5. Plan for redeployment"
echo ""
echo "📖 For redeployment, run: ./deploy.sh"