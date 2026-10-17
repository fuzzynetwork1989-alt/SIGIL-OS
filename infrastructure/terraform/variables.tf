# Terraform Variables
variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "environment" {
  description = "Environment name"
  default     = "production"
}

variable "instance_count" {
  description = "Number of EC2 instances"
  default     = 3
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.large"
}

variable "ami_id" {
  description = "AMI ID for EC2 instances"
  default     = ""
}

variable "allowed_ssh_cidr_blocks" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = []
}

variable "bucket_prefix" {
  description = "Prefix for S3 bucket names"
  default     = "sigil-os"
}
