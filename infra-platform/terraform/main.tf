# NEXORA Omega Infrastructure - Terraform Configuration
# Manages Railway, Vercel, and cloud resources

terraform {
  required_version = ">= 1.0"
  required_providers {
    railway = {
      source  = "railwayapp/railway"
      version = "~> 1.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

# Railway Provider Configuration
provider "railway" {
  token = var.railway_token
}

# Vercel Provider Configuration
provider "vercel" {
  token = var.vercel_token
}

# Variables
variable "railway_token" {
  type        = string
  description = "Railway API token"
  sensitive   = true
}

variable "vercel_token" {
  type        = string
  description = "Vercel API token"
  sensitive   = true
}

variable "project_name" {
  type        = string
  default     = "nexora-omega"
  description = "Project name"
}

# Railway Project
resource "railway_project" "nexora_omega" {
  name = var.project_name
}

# Railway Services
resource "railway_service" "postgres" {
  project_id = railway_project.nexora_omega.id
  name       = "postgres"

  postgres_config {
    disk_size_gb = 100
  }
}

resource "railway_service" "redis" {
  project_id = railway_project.nexora_omega.id
  name       = "redis"

  redis_config {
    disk_size_gb = 10
  }
}

resource "railway_service" "api_gateway" {
  project_id = railway_project.nexora_omega.id
  name       = "api-gateway"

  source {
    image = "nexora-omega/api-gateway:latest"
  }

  environment_variables = {
    DATABASE_URL = "${replace(railway_service.postgres.database_url, "/postgres", "/${var.project_name}")}"
    REDIS_URL    = railway_service.redis.redis_url
    PORT         = "3000"
  }
}

# Vercel Project
resource "vercel_project" "nexora_omega" {
  name      = var.project_name
  framework = "nextjs"

  git = {
    repository = {
      owner = "fuzzynetwork1989-alt"
      repo  = "nexora-omega"
    }
  }

  environment {
    key   = "NEXT_PUBLIC_API_URL"
    value = "https://api.nexora.omega"
  }

  environment {
    key   = "NEXT_PUBLIC_APP_URL"
    value = "https://nexora.omega"
  }
}

# Outputs
output "railway_project_url" {
  value = railway_project.nexora_omega.url
}

output "vercel_project_url" {
  value = vercel_project.nexora_omega.url
}

output "postgres_url" {
  value     = railway_service.postgres.database_url
  sensitive = true
}

output "redis_url" {
  value     = railway_service.redis.redis_url
  sensitive = true
}