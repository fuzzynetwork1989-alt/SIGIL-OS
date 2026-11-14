#!/bin/bash
# SIGIL OS Complete Installation Script for Linux/macOS
# This script installs all prerequisites for SIGIL OS

set -e

echo "========================================"
echo "SIGIL OS Complete Installation"
echo "========================================"
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    PACKAGE_MANAGER="apt"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    PACKAGE_MANAGER="brew"
else
    echo "ERROR: Unsupported OS: $OSTYPE"
    exit 1
fi

echo "Detected OS: $OS"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Rust
echo "[1/8] Installing Rust..."
if ! command_exists rustc; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
    echo "Rust installed successfully."
else
    echo "Rust already installed."
fi
echo ""

# Install Homebrew (macOS only)
if [ "$OS" == "macos" ]; then
    echo "[2/8] Installing Homebrew..."
    if ! command_exists brew; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        echo "Homebrew installed successfully."
    else
        echo "Homebrew already installed."
    fi
    echo ""
fi

# Install Node.js
echo "[3/8] Installing Node.js..."
if ! command_exists node; then
    if [ "$OS" == "macos" ]; then
        brew install node
    else
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    echo "Node.js installed successfully."
else
    echo "Node.js already installed."
fi
echo ""

# Install Git
echo "[4/8] Installing Git..."
if ! command_exists git; then
    if [ "$OS" == "macos" ]; then
        brew install git
    else
        sudo apt-get update
        sudo apt-get install -y git
    fi
    echo "Git installed successfully."
else
    echo "Git already installed."
fi
echo ""

# Install Python
echo "[5/8] Installing Python..."
if ! command_exists python3; then
    if [ "$OS" == "macos" ]; then
        brew install python@3.9
    else
        sudo apt-get update
        sudo apt-get install -y python3 python3-pip
    fi
    echo "Python installed successfully."
else
    echo "Python already installed."
fi
echo ""

# Install Python dependencies
echo "[6/8] Installing Python dependencies..."
pip3 install transformers tiktoken
echo "Python dependencies installed successfully."
echo ""

# Install build tools (Linux only)
if [ "$OS" == "linux" ]; then
    echo "[7/8] Installing build tools..."
    sudo apt-get update
    sudo apt-get install -y build-essential libssl-dev pkg-config
    echo "Build tools installed successfully."
    echo ""
fi

# Create SIGIL OS directories
echo "[8/8] Creating SIGIL OS directories..."
mkdir -p ~/.sigil-os/models
mkdir -p ~/.config/sigil-os
echo "Directories created successfully."
echo ""

# Create default configuration
echo "Creating default configuration..."
if [ ! -f ~/.config/sigil-os/config.yaml ]; then
    cat > ~/.config/sigil-os/config.yaml << EOF
# SIGIL OS Configuration

# Model Configuration
model:
  provider: "local"
  model_name: "qwen-7b"
  model_path: "$HOME/.sigil-os/models/qwen-7b"
  download_if_missing: true

# UI Configuration
ui:
  theme: "dark"
  icon_pack: "default"
  avatar_style: "realistic"

# Dream Weaving Configuration
dream_weaving:
  enabled: true
  max_generations: 10
  auto_approve_mutations: false

# Quest 3 Configuration
quest:
  enabled: false
  auto_connect: true

# API Configuration
api:
  host: "127.0.0.1"
  port: 8080
  enable_cors: true
EOF
    echo "Configuration file created at ~/.config/sigil-os/config.yaml"
else
    echo "Configuration file already exists."
fi
echo ""

echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Please restart your terminal to use the newly installed tools."
echo ""
echo "Next steps:"
echo "1. Clone the repository: git clone https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git"
echo "2. Navigate to the directory: cd SIGIL-OS"
echo "3. Build the project: cargo build --release"
echo "4. Run the API server: ./target/release/api"
echo "5. Start the web UI: cd desktop-client && npm run dev"
echo ""
echo "For detailed instructions, see COMPLETE_SETUP_GUIDE.md"
echo ""
