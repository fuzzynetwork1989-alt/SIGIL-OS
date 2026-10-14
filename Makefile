# SIGIL OS Makefile
# Provides convenient commands for building, testing, and running SIGIL OS

.PHONY: help build test run clean install-deps setup-env docker-build docker-run docker-stop

# Default target
help:
	@echo "SIGIL OS - Available commands:"
	@echo ""
	@echo "  make build           - Build the project"
	@echo "  make test            - Run all tests"
	@echo "  make run             - Build and run API server"
	@echo "  make clean           - Clean build artifacts"
	@echo "  make install-deps    - Install dependencies"
	@echo "  make setup-env       - Setup environment directories"
	@echo "  make docker-build    - Build Docker image"
	@echo "  make docker-run      - Run Docker container"
	@echo "  make docker-stop     - Stop Docker container"
	@echo ""

# Build the project
build:
	@echo "Building SIGIL OS..."
	cargo build --release

# Run tests
test:
	@echo "Running tests..."
	cargo test --release

# Build and run
run: build
	@echo "Starting API server..."
	./target/release/sigil-api

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	cargo clean
	rm -rf target/

# Install dependencies (Linux/macOS)
install-deps:
	@echo "Installing dependencies..."
	@echo "Note: This requires sudo on Linux"
	@if command -v apt-get > /dev/null; then \
		sudo apt-get update && sudo apt-get install -y build-essential pkg-config libsqlite3-dev curl; \
	elif command -v dnf > /dev/null; then \
		sudo dnf install -y gcc gcc-c++ make pkg-config sqlite-devel curl; \
	elif command -v brew > /dev/null; then \
		brew install pkg-config sqlite3; \
	else \
		echo "Unknown package manager. Please install manually."; \
	fi

# Setup environment directories
setup-env:
	@echo "Setting up environment..."
	mkdir -p ~/.sigil-os/models
	mkdir -p ~/.config/sigil-os
	mkdir -p ~/.local/share/sigil-os
	@echo "Environment directories created."

# Docker build
docker-build:
	@echo "Building Docker image..."
	docker build -t sigil-os:latest .

# Docker run
docker-run:
	@echo "Running Docker container..."
	docker-compose up -d

# Docker stop
docker-stop:
	@echo "Stopping Docker container..."
	docker-compose down
