# SIGIL OS Infrastructure as Code (Terraform)

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "sigil_os" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "sigil-os-vpc"
    Environment = var.environment
  }
}

# Public subnets
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.sigil_os.id
  cidr_block              = cidrsubnet(aws_vpc.sigil_os.cidr_block, 8, count.index, 0)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "sigil-os-public-${count.index}"
    Environment = var.environment
  }
}

# Private subnets
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.sigil_os.id
  cidr_block        = cidrsubnet(aws_vpc.sigil_os.cidr_block, 8, count.index + 4, 0)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "sigil-os-private-${count.index}"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "sigil_os" {
  vpc_id = aws_vpc.sigil_os.id

  tags = {
    Name        = "sigil-os-igw"
    Environment = var.environment
  }
}

# Route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.sigil_os.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.sigil_os.id
  }

  tags = {
    Name        = "sigil-os-public-rt"
    Environment = var.environment
  }
}

# Route table associations for public subnets
resource "aws_route_table_association" "public" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security group for application
resource "aws_security_group" "app" {
  name        = "sigil-os-app-sg"
  description = "Security group for SIGIL OS application"
  vpc_id      = aws_vpc.sigil_os.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "sigil-os-app-sg"
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "sigil-os-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "app" {
  name     = "sigil-os-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.sigil_os.id

  health_check {
    enabled             = true
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# EC2 instances for application
resource "aws_instance" "app" {
  count                  = var.instance_count
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private[count.index % length(var.availability_zones)].id
  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(file("${path.module}/user-data.sh"))

  tags = {
    Name        = "sigil-os-app-${count.index}"
    Environment = var.environment
  }
}

# S3 bucket for backups
resource "aws_s3_bucket" "backups" {
  bucket = "${var.bucket_prefix}-sigil-os-backups"

  tags = {
    Name        = "sigil-os-backups"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "delete-old-backups"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/sigil-os/app"
  retention_in_days = 30

  tags = {
    Environment = var.environment
  }
}

# CloudWatch Alarm for CPU utilization
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "sigil-os-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EC2 CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

# SNS topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "sigil-os-alerts"
}

# Variables
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

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.sigil_os.id
}

output "lb_dns_name" {
  description = "Load balancer DNS name"
  value       = aws_lb.app.dns_name
}

output "instance_ids" {
  description = "EC2 instance IDs"
  value       = aws_instance.app[*].id
}

output "backup_bucket" {
  description = "S3 bucket for backups"
  value       = aws_s3_bucket.backups.id
}
