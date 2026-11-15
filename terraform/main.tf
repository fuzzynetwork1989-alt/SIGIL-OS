# SIGIL OS Infrastructure - Terraform Configuration
# Provider: AWS (can be adapted for GCP, Azure)

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
  
  backend "s3" {
    bucket         = "sigil-os-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "sigil-os-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "SIGIL-OS"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

# VPC Configuration
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "sigil-os-${var.environment}"
  cidr = var.vpc_cidr

  azs              = var.availability_zones
  private_subnets  = var.private_subnet_cidrs
  public_subnets   = var.public_subnet_cidrs
  database_subnets = var.database_subnet_cidrs

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true

  enable_vpn_gateway = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  # PostgreSQL-specific
  create_database_subnet_group = true
  create_database_subnet_route_table = true

  tags = {
    Environment = var.environment
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "sigil-os-${var.environment}"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  # Addons
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Node Groups
  eks_managed_node_groups = {
    # Cognitive Kernel Nodes (high memory, high CPU)
    cognitive = {
      name           = "cognitive-nodes"
      instance_types = ["r6i.2xlarge", "r6i.4xlarge"]
      min_size       = 3
      max_size       = 10
      desired_size   = 3

      labels = {
        role = "cognitive"
        tier = "backend"
      }

      taints = []
    }

    # General Purpose Nodes
    general = {
      name           = "general-nodes"
      instance_types = ["m6i.xlarge", "m6i.2xlarge"]
      min_size       = 2
      max_size       = 5
      desired_size   = 2

      labels = {
        role = "general"
        tier = "workload"
      }

      taints = []
    }

    # Monitoring Nodes
    monitoring = {
      name           = "monitoring-nodes"
      instance_types = ["m6i.large"]
      min_size       = 1
      max_size       = 2
      desired_size   = 1

      labels = {
        role = "monitoring"
        tier = "infra"
      }

      taints = [{
        key    = "dedicated"
        value  = "monitoring"
        effect = "NO_SCHEDULE"
      }]
    }
  }

  # IRSA for IAM roles
  enable_irsa = true

  tags = {
    Environment = var.environment
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "sigil_postgres" {
  identifier = "sigil-postgres-${var.environment}"

  engine         = "postgres"
  engine_version = "16.1"
  instance_class = "db.r6g.xlarge"

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_type           = "gp3"
  storage_encrypted      = true

  db_name  = "sigil_db"
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.database.id]

  multi_az               = true
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  performance_insights_enabled = true
  monitoring_interval          = 60

  deletion_protection = true
  skip_final_snapshot = false

  tags = {
    Environment = var.environment
  }
}

# ElastiCache Redis
resource "aws_elasticache_replication_group" "sigil_redis" {
  replication_group_id = "sigil-redis-${var.environment}"
  description          = "SIGIL OS Redis Cluster"

  node_type            = "cache.r6g.large"
  num_cache_clusters   = 2
  port                 = 6379
  engine               = "redis"
  engine_version       = "7.0"

  automatic_failover_enabled = true
  multi_az_enabled          = true

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled  = true

  parameter_group_name = aws_elasticache_parameter_group.main.name

  tags = {
    Environment = var.environment
  }
}

# Neo4j on EC2 (using Docker)
resource "aws_instance" "neo4j" {
  count         = var.environment == "production" ? 1 : 0
  ami           = data.aws_ami.ubuntu.id
  instance_type = "r6i.2xlarge"

  subnet_id                   = module.vpc.private_subnets[0]
  vpc_security_group_ids      = [aws_security_group.neo4j.id]
  iam_instance_profile       = aws_iam_instance_profile.neo4j.name

  root_block_device {
    volume_type = "gp3"
    volume_size = 200
    encrypted   = true
  }

  user_data = base64encode(templatefile("${path.module}/neo4j-user-data.sh", {
    neo4j_password = var.neo4j_password
  }))

  tags = {
    Name        = "sigil-neo4j-${var.environment}"
    Environment = var.environment
  }
}

# S3 for artifact storage
resource "aws_s3_bucket" "sigil_artifacts" {
  bucket = "sigil-os-artifacts-${var.environment}-${random_id.bucket_suffix.hex}"

  tags = {
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "sigil_artifacts" {
  bucket = aws_s3_bucket.sigil_artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "sigil_artifacts" {
  bucket = aws_s3_bucket.sigil_artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudWatch for logs and metrics
resource "aws_cloudwatch_log_group" "sigil_kernel" {
  name              = "/sigil-os/cognitive-kernel"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "sigil_web" {
  name              = "/sigil-os/web-console"
  retention_in_days = 30
}

# IAM Roles
resource "aws_iam_role" "sigil_eks_nodes" {
  name = "sigil-eks-nodes-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_instance_profile" "neo4j" {
  name = "sigil-neo4j-${var.environment}"
  role = aws_iam_role.neo4j_ec2.name
}

resource "aws_iam_role" "neo4j_ec2" {
  name = "sigil-neo4j-ec2-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "s3-access"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
          ]
          Resource = "${aws_s3_bucket.sigil_artifacts.arn}/*"
        }
      ]
    })
  }
}

# Security Groups
resource "aws_security_group" "database" {
  name        = "sigil-database-${var.environment}"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_security_group" "redis" {
  name        = "sigil-redis-${var.environment}"
  description = "Security group for ElastiCache Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_security_group" "neo4j" {
  name        = "sigil-neo4j-${var.environment}"
  description = "Security group for Neo4j"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 7474
    to_port     = 7474
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets
  }

  ingress {
    from_port   = 7687
    to_port     = 7687
    protocol    = "tcp"
    cidr_blocks = module.vpc.private_subnets
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
  }
}

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "sigil-redis-subnet-${var.environment}"
  subnet_ids = module.vpc.database_subnets
}

# ElastiCache Parameter Group
resource "aws_elasticache_parameter_group" "main" {
  name        = "sigil-redis-params-${var.environment}"
  family      = "redis7"
  description = "SIGIL OS Redis parameter group"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
}

# Data sources
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Random ID for bucket naming
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Outputs
output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}

output "postgres_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.sigil_postgres.endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_replication_group.sigil_redis.primary_endpoint_address
}

output "neo4j_private_ip" {
  description = "Neo4j instance private IP"
  value       = aws_instance.neo4j[0].private_ip
}

output "s3_bucket" {
  description = "S3 bucket for artifacts"
  value       = aws_s3_bucket.sigil_artifacts.id
}
