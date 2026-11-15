output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "cluster_iam_role_arn" {
  description = "IAM role ARN of the EKS cluster"
  value       = module.eks.cluster_iam_role_arn
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnets
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnets
}

output "postgres_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.sigil_postgres.endpoint
  sensitive   = true
}

output "postgres_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.sigil_postgres.port
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_replication_group.sigil_redis.primary_endpoint_address
  sensitive   = true
}

output "redis_port" {
  description = "ElastiCache Redis port"
  value       = 6379
}

output "neo4j_private_ip" {
  description = "Neo4j instance private IP"
  value       = aws_instance.neo4j[0].private_ip
  sensitive   = true
}

output "s3_bucket" {
  description = "S3 bucket for artifacts"
  value       = aws_s3_bucket.sigil_artifacts.id
}

output "cloudwatch_log_group_kernel" {
  description = "CloudWatch log group for cognitive kernel"
  value       = aws_cloudwatch_log_group.sigil_kernel.name
}

output "cloudwatch_log_group_web" {
  description = "CloudWatch log group for web console"
  value       = aws_cloudwatch_log_group.sigil_web.name
}
