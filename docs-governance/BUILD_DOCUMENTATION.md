# NEXORA Omega Build Documentation

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 8.0.0 or higher
- **Rust**: Version 1.75.0 or higher (for platform-core)
- **Docker**: Latest version (for local development)
- **Git**: Latest version

### Required Accounts
- **GitHub Account**: For repository access and CI/CD
- **Vercel Account**: For web deployment
- **Railway Account**: For backend services
- **Hugging Face Account**: For model access

### Required API Keys and Secrets
- **VERCEL_TOKEN**: Vercel API token for deployment
- **VERCEL_ORG_ID**: Vercel organization ID
- **VERCEL_PROJECT_ID**: Vercel project ID
- **RAILWAY_TOKEN**: Railway API token for deployment
- **HUGGINGFACE_API_KEY**: Hugging Face API key for model access
- **SNYK_TOKEN**: Snyk API token for security scanning (optional)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/fuzzynetwork1989-alt/nexora-omega.git
cd nexora-omega
```

### 2. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm@8

# Install all dependencies
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp infra-platform/vercel/.env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=localhost
NEXT_PUBLIC_AUTH_CLIENT_ID=nexora-web-console

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_VISION=true
NEXT_PUBLIC_ENABLE_CODE_EXECUTION=true

# Development
NODE_ENV=development
```

### 4. Start Development Servers

#### Web Console (Next.js)

```bash
cd web-console
pnpm dev
```

The web console will be available at `http://localhost:3000`

#### Backend Services (Railway)

```bash
cd infra-platform/railway
docker-compose up
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- API Gateway on port 3000
- Identity Service on port 3001
- Cognitive Kernel on port 3002
- Model Gateway on port 3003

### 5. Build Platform Core (Rust)

```bash
cd platform-core
cargo build
```

## Build Process

### Build All Packages

```bash
# Build all TypeScript packages
pnpm build

# Build Rust platform core
cd platform-core
cargo build --release
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run Rust tests
cd platform-core
cargo test
```

### Run Linting

```bash
# Run linters
pnpm lint

# Run Rust clippy
cd platform-core
cargo clippy
```

### Type Checking

```bash
# Run TypeScript type checking
pnpm typecheck
```

## Production Build

### 1. Build for Production

```bash
# Build all packages for production
pnpm build

# Build Rust for production
cd platform-core
cargo build --release
```

### 2. Run Production Build Locally

```bash
# Start web console in production mode
cd web-console
pnpm start
```

## CI/CD Pipeline

### GitHub Actions

The CI/CD pipeline is configured in `.github/workflows/ci.yml` and runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Pipeline Stages

1. **Contract Validation**: Validates JSON schemas
2. **Rust Build & Test**: Builds and tests Rust code
3. **TypeScript Build & Test**: Builds and tests TypeScript code
4. **Security Scan**: Runs Trivy vulnerability scanner
5. **Dependency Scan**: Runs npm audit and Snyk
6. **Deploy to Vercel**: Deploys web console (main branch only)
7. **Deploy to Railway**: Deploys backend services (main branch only)

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `RAILWAY_TOKEN`: Your Railway API token
- `SNYK_TOKEN`: Your Snyk API token (optional)

## Troubleshooting

### Dependency Issues

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Build Failures

```bash
# Clear Next.js cache
cd web-console
rm -rf .next

# Rebuild
pnpm build
```

### Rust Build Issues

```bash
# Update Rust toolchain
rustup update

# Clean build
cd platform-core
cargo clean
cargo build
```

### Docker Issues

```bash
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild containers
docker-compose build
```

## Performance Optimization

### Web Console

- Enable Next.js Image Optimization
- Use React.memo for expensive components
- Implement code splitting
- Use SWR for data fetching

### Backend Services

- Use connection pooling for databases
- Implement caching with Redis
- Use async operations
- Optimize database queries

### Platform Core

- Use release builds
- Enable LTO (Link Time Optimization)
- Use parallel compilation
- Optimize memory usage

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use environment variables** for all sensitive data
3. **Run security scans** before deployment
4. **Keep dependencies updated**
5. **Use HTTPS** in production
6. **Implement rate limiting**
7. **Validate all inputs**
8. **Use prepared statements** for database queries

## Monitoring and Logging

### Application Monitoring

- Use OpenTelemetry for distributed tracing
- Implement structured logging
- Set up error tracking (Sentry)
- Monitor performance metrics

### Infrastructure Monitoring

- Monitor Railway service health
- Monitor Vercel deployment status
- Set up alerts for failures
- Track resource usage

## Backup and Recovery

### Database Backups

```bash
# Backup PostgreSQL
docker exec postgres pg_dump -U postgres nexora_omega > backup.sql

# Restore PostgreSQL
docker exec -i postgres psql -U postgres nexora_omega < backup.sql
```

### Redis Backups

```bash
# Backup Redis
docker exec redis redis-cli SAVE
docker cp redis:/data/dump.json ./redis-backup.json

# Restore Redis
docker cp ./redis-backup.json redis:/data/dump.json
docker exec redis redis-cli --rdb /data/dump.json
```

## Version Management

### Semantic Versioning

Follow semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Process

1. Update version numbers
2. Update CHANGELOG.md
3. Create git tag
4. Push to GitHub
5. Deploy to staging
6. Run smoke tests
7. Deploy to production

## Code Quality Standards

### TypeScript

- Use strict mode
- Avoid `any` types
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Follow the project's ESLint configuration

### Rust

- Follow Rust naming conventions
- Use `clippy` for linting
- Write comprehensive tests
- Document public APIs
- Follow the project's formatting standards

### Code Review

- All code must be reviewed before merge
- At least one approval required
- All CI checks must pass
- Security review for sensitive changes

## Documentation Standards

- Keep documentation up to date
- Use clear, concise language
- Include code examples
- Document breaking changes
- Maintain API documentation

## Support and Resources

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: See `docs-governance/` directory
- **Architecture Decision Records**: See `docs-governance/adr/`
- **API Documentation**: See `contracts/` directory