# Multi-stage Dockerfile for SIGIL OS
# Optimized for small image size and fast builds

# Stage 1: Build
FROM rust:1.92-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Cargo files for dependency caching
COPY Cargo.toml Cargo.lock ./
COPY sigil-core/ ./sigil-core/
COPY model-fabric/ ./model-fabric/
COPY ui-ux/ ./ui-ux/
COPY dream-weaving/ ./dream-weaving/
COPY quest-integration/ ./quest-integration/
COPY .cargo/ ./.cargo/

# Build release binary
RUN cargo build --release --bin api

# Stage 2: Runtime
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 sigil

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/api /app/sigil-api

# Change ownership to non-root user
RUN chown -R sigil:sigil /app

# Switch to non-root user
USER sigil

# Expose port (can be overridden by PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV PORT=8080
ENV RUST_LOG=info
ENV SIGIL_HOST=0.0.0.0
ENV SIGIL_PORT=8080

# Run the application
CMD ["/app/sigil-api"]
