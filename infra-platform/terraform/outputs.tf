# Terraform Outputs for NEXORA Omega Infrastructure

output "project_name" {
  description = "Name of the NEXORA Omega project"
  value       = var.project_name
}

output "environment" {
  description = "Current deployment environment"
  value       = var.environment
}

output "railway_project_id" {
  description = "Railway project ID"
  value       = railway_project.nexora_omega.id
}

output "railway_project_url" {
  description = "Railway project URL"
  value       = railway_project.nexora_omega.url
}

output "postgres_host" {
  description = "PostgreSQL host"
  value       = railway_service.postgres.host
}

output "postgres_port" {
  description = "PostgreSQL port"
  value       = railway_service.postgres.port
}

output "postgres_database" {
  description = "PostgreSQL database name"
  value       = railway_service.postgres.database_name
}

output "postgres_url" {
  description     = "PostgreSQL connection URL"
  value           = railway_service.postgres.database_url
  sensitive       = true
}

output "redis_host" {
  description = "Redis host"
  value       = railway_service.redis.host
}

output "redis_port" {
  description = "Redis port"
  value       = railway_service.redis.port
}

output "redis_url" {
  description     = "Redis connection URL"
  value           = railway_service.redis.redis_url
  sensitive       = true
}

output "api_gateway_url" {
  description = "API Gateway service URL"
  value       = railway_service.api_gateway.url
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.nexora_omega.id
}

output "vercel_project_url" {
  description = "Vercel project URL"
  value       = vercel_project.nexora_omega.url
}

output "deployment_instructions" {
  description = "Instructions for deploying the infrastructure"
  value = <<EOT
Infrastructure Deployment Instructions:

1. Initialize Terraform:
   terraform init

2. Plan the deployment:
   terraform plan

3. Apply the configuration:
   terraform apply

4. After deployment, configure environment variables:
   - Copy the postgres_url and redis_url outputs
   - Add them to your Railway service environment variables
   - Configure Vercel environment variables with API URLs

5. Deploy applications:
   - Web console: Vercel will auto-deploy on git push
   - Backend services: Railway will auto-deploy on git push
   - GPU inference: Use the deployment manifest with kubectl

6. Monitor deployment:
   - Check Railway dashboard for service health
   - Check Vercel dashboard for web deployment status
   - Monitor GPU inference metrics on port 8001
EOT
}