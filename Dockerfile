# SIGIL OS Dockerfile
# Multi-stage build for optimal image size

# Stage 1: Build
FROM rust:1.75-slim as builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies
RUN cargo build --release && rm -rf src

# Copy source code
COPY . .

# Build the actual project
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy binaries from builder
COPY --from=builder /build/target/release/sigil-api /app/
COPY --from=builder /build/target/release/sigil-cli /app/

# Create data directory
RUN mkdir -p /data

# Set environment variables
ENV SIGIL_OS_DATA=/data
ENV API_HOST=0.0.0.0
ENV API_PORT=8080

# Expose API port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the API server
CMD ["./sigil-api"]
