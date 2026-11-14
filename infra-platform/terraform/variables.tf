# Terraform Variables for NEXORA Omega Infrastructure

variable "railway_token" {
  type        = string
  description = "Railway API token for infrastructure management"
  sensitive   = true
}

variable "vercel_token" {
  type        = string
  description = "Vercel API token for web deployment"
  sensitive   = true
}

variable "project_name" {
  type        = string
  default     = "nexora-omega"
  description = "Name of the NEXORA Omega project"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment (development, staging, production)"
}

variable "postgres_disk_size" {
  type        = number
  default     = 100
  description = "PostgreSQL disk size in GB"
}

variable "redis_disk_size" {
  type        = number
  default     = 10
  description = "Redis disk size in GB"
}

variable "enable_gpu_inference" {
  type        = bool
  default     = true
  description = "Enable GPU inference services"
}

variable "gpu_count" {
  type        = number
  default     = 4
  description = "Number of GPUs for inference"
}

variable "gpu_memory_gb" {
  type        = number
  default     = 64
  description = "GPU memory in GB"
}