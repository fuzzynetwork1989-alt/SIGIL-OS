# SIGIL OS - Installation Guidebook

**Version:** 1.0.0
**Last Updated:** 2026-10-07
**Platforms:** Windows, Linux, macOS, Meta Quest 3

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

**Desktop (Windows/Linux/macOS):**
- Processor: x86_64 or ARM64 with 4+ cores
- RAM: 8 GB minimum (16 GB recommended)
- Storage: 20 GB free space (50 GB recommended for models)
- Internet: Required for model downloads

**Meta Quest 3:**
- Meta Quest 3 headset
- Android/Quest SDK support
- 2 GB free storage
- Quest OS v50 or higher

### Recommended Requirements

**Desktop:**
- Processor: x86_64 with 8+ cores
- RAM: 32 GB
- Storage: 100 GB SSD
- GPU: NVIDIA RTX 3060 or equivalent (for accelerated inference)

---

## Prerequisites

### Required Software

#### 1. Rust Toolchain

Install Rust using rustup:

**Windows:**
```powershell
# Download and run rustup-init.exe from https://rustup.rs/
# Or use winget:
winget install Rustlang.Rustup
```

**Linux/macOS:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verify installation:
```bash
rustc --version
cargo --version
```

#### 2. Git

**Windows:**
```powershell
winget install Git.Git
```

**Linux:**
```bash
sudo apt install git  # Ubuntu/Debian
sudo dnf install git  # Fedora
```

**macOS:**
```bash
brew install git
```

#### 3. Build Tools

**Windows:**
- Visual Studio Build Tools (C++ build tools)
- Microsoft C++ Build Tools 2022

**Linux:**
```bash
sudo apt install build-essential pkg-config  # Ubuntu/Debian
sudo dnf install gcc gcc-c++ make  # Fedora
```

**macOS:**
```bash
xcode-select --install
```

#### 4. SQLite Development Libraries

**Linux:**
```bash
sudo apt install libsqlite3-dev  # Ubuntu/Debian
sudo dnf install sqlite-devel  # Fedora
```

**macOS:**
```bash
brew install sqlite3
```

---

## Installation

### Option 1: Build from Source

#### Step 1: Clone the Repository

```bash
git clone https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git
cd SIGIL-OS
```

#### Step 2: Build the Project

```bash
# Build all workspace crates
cargo build --release

# This will compile:
# - sigil-core (signing, persistence, API)
# - model-fabric (ML integration)
# - ui-ux (Slint-based UI)
# - dream-weaving (cognitive engine)
# - quest-integration (Quest 3 support)
```

#### Step 3: Run Tests

```bash
cargo test --release
```

#### Step 4: Install Binaries

**Windows:**
```powershell
# Copy binaries to installation directory
copy target\release\sigil-api.exe C:\Program Files\SIGIL-OS\
copy target\release\sigil-cli.exe C:\Program Files\SIGIL-OS\
```

**Linux/macOS:**
```bash
sudo cp target/release/sigil-api /usr/local/bin/
sudo cp target/release/sigil-cli /usr/local/bin/
```

### Option 2: Download Pre-built Binaries

Coming soon! Pre-built binaries will be available from the GitHub Releases page.

---

## Configuration

### Step 1: Create Configuration Directory

**Windows:**
```powershell
mkdir $env:APPDATA\SIGIL-OS
```

**Linux:**
```bash
mkdir -p ~/.config/sigil-os
```

**macOS:**
```bash
mkdir -p ~/Library/Application\ Support/SIGIL-OS
```

### Step 2: Create Configuration File

Create `config.yaml` in the configuration directory:

```yaml
# SIGIL OS Configuration

# Model Configuration
model:
  provider: "local"
  model_name: "qwen-7b"
  model_path: "~/.sigil-os/models/qwen-7b"
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
  enabled: false  # Set to true if Quest device connected
  auto_connect: true

# API Configuration
api:
  host: "127.0.0.1"
  port: 8080
  enable_cors: true
```

### Step 3: Download Model Weights (Optional)

If using local models:

```bash
# Create models directory
mkdir -p ~/.sigil-os/models

# Download Qwen 7B model (13 GB)
# This will be automated in future versions
# For now, use placeholder models for testing
```

---

## Verification

### Step 1: Start the API Server

```bash
sigil-api
```

Expected output:
```
[INFO] SIGIL OS API starting...
[INFO] Listening on http://127.0.0.1:8080
[INFO] Model Fabric initialized
[INFO] Dream Weaving initialized
[INFO] Ready
```

### Step 2: Check Health Endpoint

```bash
curl http://127.0.0.1:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "components": {
    "sigil-core": "ok",
    "model-fabric": "ok",
    "dream-weaving": "ok",
    "ui-ux": "ok"
  }
}
```

### Step 3: Launch UI

```bash
sigil-ui
```

The Slint-based UI should appear with:
- Chat interface
- Avatar display
- Theme selector
- Dream Weaving controls

---

## Troubleshooting

### Build Errors

**Error: "cannot find -lsqlite3"**

**Solution:** Install SQLite development libraries (see Prerequisites).

**Error: "Failed to compile candle"**

**Solution:** Candle ML framework has dependency conflicts. Model Fabric will use placeholder inference until this is resolved. This is documented in FINAL_COMPLETION_REPORT.md.

### Runtime Errors

**Error: "Model not found"**

**Solution:** Download model weights or configure `download_if_missing: true` in config.yaml.

**Error: "Permission denied"**

**Solution:** Ensure user has write permissions to configuration directory.

**Error: "Quest device not connected"**

**Solution:** Ensure Quest 3 is connected via USB, Developer Mode is enabled, and Quest SDK is installed.

### UI Issues

**Error: "Slint initialization failed"**

**Solution:** Ensure graphics drivers are up to date. Slint requires OpenGL or Vulkan support.

---

## Next Steps

After successful installation:

1. Read the [User Manual](USER_MANUAL.md)
2. Configure your preferred model and settings
3. Explore the Dream Weaving features
4. (Optional) Set up Quest 3 integration

---

## Support

- **GitHub Issues:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues
- **Documentation:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/tree/main/docs
- **Discord:** (Coming soon)

---

## License

SIGIL OS is licensed under the MIT License. See LICENSE file for details.
