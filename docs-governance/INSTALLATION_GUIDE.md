# NEXORA Omega Installation Guide

## System Requirements

### Minimum Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB
- **Network**: Stable internet connection

### Recommended Requirements
- **CPU**: 8 cores
- **RAM**: 16GB
- **Storage**: 100GB SSD
- **Network**: High-speed internet connection

### GPU Requirements (for local inference)
- **GPU**: NVIDIA GPU with 8GB+ VRAM
- **CUDA**: Version 11.0 or higher
- **Drivers**: Latest NVIDIA drivers

## Operating System Support

- **Linux**: Ubuntu 20.04+, Debian 11+, CentOS 8+
- **macOS**: macOS 11.0+ (Apple Silicon supported)
- **Windows**: Windows 10+ (WSL2 recommended)

## Installation Methods

### Method 1: Docker Installation (Recommended)

#### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

#### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/fuzzynetwork1989-alt/nexora-omega.git
cd nexora-omega
```

2. **Configure environment variables**
```bash
cp infra-platform/railway/.env.example .env
# Edit .env with your configuration
```

3. **Start services with Docker Compose**
```bash
cd infra-platform/railway
docker-compose up -d
```

4. **Verify installation**
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f
```

5. **Access the application**
- Web Console: http://localhost:3000
- API Gateway: http://localhost:3000
- Health Check: http://localhost:3000/health

### Method 2: Manual Installation

#### Step 1: Install System Dependencies

**Ubuntu/Debian**
```bash
sudo apt update
sudo apt install -y curl git nodejs npm postgresql redis-server
```

**macOS**
```bash
brew install curl git node postgresql redis
```

**Windows (WSL2)**
```bash
sudo apt update
sudo apt install -y curl git nodejs npm postgresql redis-server
```

#### Step 2: Install Development Tools

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install pnpm
npm install -g pnpm@8

# Install Docker
# Follow official Docker installation guide for your OS
```

#### Step 3: Clone and Setup Repository

```bash
git clone https://github.com/fuzzynetwork1989-alt/nexora-omega.git
cd nexora-omega
pnpm install
```

#### Step 4: Setup PostgreSQL

```bash
# Create database
sudo -u postgres createdb nexora_omega

# Create user
sudo -u postgres createuser nexora_user

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nexora_omega TO nexora_user;"
```

#### Step 5: Setup Redis

```bash
# Start Redis
sudo systemctl start redis
sudo systemctl enable redis

# Verify Redis is running
redis-cli ping
```

#### Step 6: Build and Start Services

```bash
# Build platform core
cd platform-core
cargo build --release

# Build web console
cd ../web-console
pnpm build

# Start services (in separate terminals)
# Terminal 1: API Gateway
cd ../cloud-control-plane/services/api-gateway
pnpm start

# Terminal 2: Web Console
cd ../../web-console
pnpm start
```

### Method 3: Cloud Deployment

#### Railway Deployment

1. **Connect GitHub to Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `nexora-omega` repository

2. **Configure Services**
   - Add PostgreSQL service
   - Add Redis service
   - Configure environment variables

3. **Deploy**
   - Railway will automatically deploy on push to main branch

#### Vercel Deployment

1. **Connect GitHub to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New Project" → "Continue with GitHub"
   - Select `nexora-omega` repository

2. **Configure**
   - Set root directory to `web-console`
   - Configure environment variables
   - Set build command to `pnpm build`
   - Set output directory to `.next`

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://nexora_user:password@localhost:5432/nexora_omega

# Redis
REDIS_URL=redis://localhost:6379

# API
API_PORT=3000
API_HOST=0.0.0.0

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400

# Model Gateway
HUGGINGFACE_API_KEY=your-huggingface-api-key
MODEL_GATEWAY_URL=http://localhost:3003

# Web Console
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
ENABLE_VOICE=true
ENABLE_VISION=true
ENABLE_CODE_EXECUTION=true
```

### Advanced Configuration

#### PostgreSQL Configuration

Edit `infra-platform/railway/docker-compose.yml`:

```yaml
postgres:
  environment:
    POSTGRES_MAX_CONNECTIONS: 100
    POSTGRES_SHARED_BUFFERS: 256MB
    POSTGRES_WORK_MEM: 16MB
```

#### Redis Configuration

```yaml
redis:
  command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

#### Model Gateway Configuration

Edit `infra-platform/gpu-inference/vllm-config.yaml`:

```yaml
model: "Qwen/Qwen3-30B-A3B-Instruct-2507"
tensor-parallel-size: 4
gpu-memory-utilization: 0.9
max-model-len: 262144
```

## Verification

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Check database connection
psql -U nexora_user -d nexora_omega -c "SELECT 1;"

# Check Redis connection
redis-cli ping
```

### Service Status

```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs api-gateway
docker-compose logs identity-service
docker-compose logs cognitive-kernel
```

### Application Testing

```bash
# Run web console tests
cd web-console
pnpm test

# Run platform core tests
cd platform-core
cargo test

# Run integration tests
pnpm test:e2e
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Database Connection Failed

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connection
psql -U nexora_user -d nexora_omega
```

#### Redis Connection Failed

```bash
# Check Redis status
sudo systemctl status redis

# Restart Redis
sudo systemctl restart redis

# Check connection
redis-cli ping
```

#### Docker Issues

```bash
# Restart Docker
sudo systemctl restart docker

# Clean Docker cache
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```

### Logs and Debugging

```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway

# Enable debug logging
export LOG_LEVEL=debug
```

## Uninstallation

### Docker Uninstallation

```bash
# Stop and remove containers
docker-compose down -v

# Remove images
docker rmi $(docker images -q nexora-omega*)

# Remove volumes
docker volume rm $(docker volume ls -q)
```

### Manual Uninstallation

```bash
# Stop services
sudo systemctl stop postgresql redis

# Remove database
sudo -u postgres dropdb nexora_omega
sudo -u postgres dropuser nexora_user

# Remove application files
rm -rf /path/to/nexora-omega

# Remove dependencies
# (Reverse of installation steps)
```

## Upgrading

### Upgrade Process

1. **Backup current installation**
```bash
# Backup database
pg_dump -U nexora_user nexora_omega > backup.sql

# Backup configuration
cp .env .env.backup
```

2. **Pull latest changes**
```bash
git pull origin main
```

3. **Update dependencies**
```bash
pnpm install
cd platform-core
cargo update
```

4. **Run migrations**
```bash
# Run database migrations
pnpm migrate
```

5. **Restart services**
```bash
docker-compose down
docker-compose up -d
```

6. **Verify upgrade**
```bash
# Run health checks
curl http://localhost:3000/health

# Run tests
pnpm test
```

## Support

- **Documentation**: See `docs-governance/` directory
- **Issues**: Report on GitHub Issues
- **Community**: Join our Discord server
- **Email**: support@nexora.omega