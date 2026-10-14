# SIGIL OS - First-Time Installation Guidebook

**Version:** 1.0.0  
**Last Updated:** 2026-10-07  
**Target Audience:** First-time app builders and developers

---

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Prerequisites Installation](#prerequisites-installation)
4. [SIGIL OS Installation](#sigil-os-installation)
5. [Server Startup Guide](#server-startup-guide)
6. [Desktop Installation](#desktop-installation)
7. [Mobile Installation](#mobile-installation)
8. [Web UI Setup](#web-ui-setup)
9. [Quest 3 Setup](#quest-3-setup)
10. [Configuration](#configuration)
11. [Verification](#verification)
12. [Troubleshooting](#troubleshooting)
13. [Next Steps](#next-steps)

---

## Overview

SIGIL OS is a Post-AI Operating System with Cryptographic Warrant. This guide will walk you through the complete installation process for building and running SIGIL OS on Desktop, Mobile, Web, and Meta Quest 3.

### What You'll Install

1. **Desktop Application** - Full-featured SIGIL OS with Slint UI
2. **Web Interface** - Browser-based access to SIGIL OS
3. **Mobile App** - iOS and Android applications (future)
4. **Quest 3 Integration** - Mixed reality experience on Meta Quest 3

### Components You'll Run

1. **API Server** (`sigil-api`) - REST API for all SIGIL OS services
2. **Model Fabric** - ML inference engine (Qwen 7B)
3. **Dream Weaving** - Self-evolving cognitive system
4. **Persistence Layer** - SQLite database with cryptographic signing
5. **UI Layer** - Slint-based desktop interface

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

## Prerequisites Installation

### Windows

SIGIL OS provides automated installation scripts for Windows. Run them in order:

#### Step 1: Install Prerequisites

Right-click on `install-prerequisites.bat` and select **"Run as Administrator"**.

This script will install:
- Rust toolchain (via rustup)
- Git
- Visual Studio Build Tools (C++ build tools)

**Manual Installation:**

If the script fails, install manually:

1. **Rust:**
   - Download from https://rustup.rs/
   - Run `rustup-init.exe`
   - Follow the prompts

2. **Git:**
   - Download from https://git-scm.com/
   - Install with default settings

3. **Visual Studio Build Tools:**
   - Download from https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
   - Install "Desktop development with C++" workload

#### Step 2: Setup Environment

Run `setup-environment.bat` to create SIGIL OS directories and set environment variables.

#### Step 3: Verify Installation

Open a new terminal and verify:

```powershell
rustc --version
cargo --version
git --version
```

### Linux

#### Step 1: Install Build Tools

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y build-essential pkg-config git curl
```

**Fedora:**
```bash
sudo dnf install -y gcc gcc-c++ make git curl
```

#### Step 2: Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### Step 3: Install SQLite Development Libraries

**Ubuntu/Debian:**
```bash
sudo apt install -y libsqlite3-dev
```

**Fedora:**
```bash
sudo dnf install -y sqlite-devel
```

#### Step 4: Verify Installation

```bash
rustc --version
cargo --version
git --version
```

### macOS

#### Step 1: Install Xcode Command Line Tools

```bash
xcode-select --install
```

#### Step 2: Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 3: Install Rust

```bash
brew install rust
```

#### Step 4: Install SQLite

```bash
brew install sqlite3
```

#### Step 5: Verify Installation

```bash
rustc --version
cargo --version
git --version
```

---

## SIGIL OS Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git
cd SIGIL-OS
```

### Step 2: Build the Project

**Windows:**
```batch
build.bat
```

**Linux/macOS:**
```bash
cargo build --release
```

This will compile all workspace crates:
- `sigil-core` (signing, persistence, API)
- `model-fabric` (ML integration with Candle v0.11.0)
- `ui-ux` (Slint-based UI)
- `dream-weaving` (cognitive engine)
- `quest-integration` (Quest 3 support)

**Build Time:** 5-15 minutes depending on your system

### Step 3: Run Tests

**Windows:**
```batch
run-tests.bat
```

**Linux/macOS:**
```bash
cargo test --release
```

Expected output: All tests passing (66/66 tests)

---

## Server Startup Guide

SIGIL OS requires several servers to be running. This section explains what each server does and how to start it.

### Server Architecture

```
┌─────────────────────────────────────────┐
│         SIGIL OS API Server             │
│         (Port 8080)                      │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Model Fabric │  │Dream Weaving │    │
│  │   (ML Engine)│  │ (Cognitive)  │    │
│  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  Persistence │  │  Sigil Core  │    │
│  │  (Database)  │  │  (Signing)   │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### Server Components

#### 1. API Server (`sigil-api`)

**Purpose:** REST API server that handles all HTTP requests

**Port:** 8080 (default)

**Endpoints:**
- `GET /health` - Health check
- `POST /api/v1/chat` - Chat with AI
- `POST /api/v1/dream` - Dream Weaving operations
- `GET /api/v1/sigil/:id` - Retrieve sigil (cryptographic proof)

**How to Start:**

**Windows:**
```batch
run-api.bat
```

**Linux/macOS:**
```bash
./target/release/sigil-api
```

**Expected Output:**
```
[INFO] SIGIL OS API starting...
[INFO] Listening on http://127.0.0.1:8080
[INFO] Model Fabric initialized
[INFO] Dream Weaving initialized
[INFO] Persistence layer initialized
[INFO] Ready
```

#### 2. Model Fabric (Integrated with API)

**Purpose:** ML inference engine using Qwen 7B model

**Status:** Integrated with API server (no separate process needed)

**Configuration:** Set in `config.yaml` under `model` section

#### 3. Dream Weaving (Integrated with API)

**Purpose:** Self-evolving cognitive system

**Status:** Integrated with API server (no separate process needed)

**Configuration:** Set in `config.yaml` under `dream_weaving` section

#### 4. Persistence Layer (Integrated with API)

**Purpose:** SQLite database with cryptographic signing

**Status:** Integrated with API server (no separate process needed)

**Database Location:** `%LOCALAPPDATA%\SIGIL-OS\sigil.db` (Windows) or `~/.local/share/sigil-os/sigil.db` (Linux/macOS)

### Starting All Servers (Windows)

**Option 1: Build and Run (One Step)**
```batch
build-and-run.bat
```

This will:
1. Build the project
2. Start the API server
3. Initialize all components

**Option 2: Separate Steps**
```batch
# Step 1: Build
build.bat

# Step 2: Start API server
run-api.bat
```

### Starting All Servers (Linux/macOS)

```bash
# Step 1: Build
cargo build --release

# Step 2: Start API server
./target/release/sigil-api
```

### Verifying Server Status

**Check if API server is running:**

```bash
curl http://127.0.0.1:8080/health
```

**Expected Response:**
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

### Stopping Servers

**Windows:** Press `Ctrl+C` in the terminal running the API server

**Linux/macOS:** Press `Ctrl+C` in the terminal running the API server

---

## Desktop Installation

### Windows

#### Step 1: Build the Project

```batch
build.bat
```

#### Step 2: Run the API Server

```batch
run-api.bat
```

The API server will start on `http://127.0.0.1:8080`

#### Step 3: Launch the Desktop UI

The desktop UI is currently under development. When ready, run:

```batch
target\release\sigil-ui.exe
```

The Slint-based UI will appear with:
- Chat interface
- Avatar display
- Theme selector
- Dream Weaving controls

### Linux

#### Step 1: Build the Project

```bash
cargo build --release
```

#### Step 2: Run the API Server

```bash
./target/release/sigil-api
```

#### Step 3: Launch the Desktop UI

```bash
./target/release/sigil-ui
```

### macOS

#### Step 1: Build the Project

```bash
cargo build --release
```

#### Step 2: Run the API Server

```bash
./target/release/sigil-api
```

#### Step 3: Launch the Desktop UI

```bash
./target/release/sigil-ui
```

---

## Mobile Installation

Mobile apps (iOS and Android) are planned for Version 1.1 (Q4 2026). For now, you can access SIGIL OS via the Web UI (see next section).

### Future Mobile Setup

When mobile apps are available:

#### iOS

1. Download from App Store
2. Sign in with your SIGIL OS account
3. Configure server URL (if running self-hosted)
4. Enable push notifications (optional)

#### Android

1. Download from Google Play Store
2. Sign in with your SIGIL OS account
3. Configure server URL (if running self-hosted)
4. Enable push notifications (optional)

---

## Web UI Setup

The Web UI provides browser-based access to SIGIL OS.

### Step 1: Start the API Server

Follow the [Server Startup Guide](#server-startup-guide) to start the API server.

### Step 2: Access the Web UI

Open your browser and navigate to:

```
http://127.0.0.1:8080
```

The Web UI will load with:
- Chat interface
- Settings panel
- Dream Weaving dashboard
- Sigil verification tools

### Web UI Features

- **Chat:** Real-time conversation with AI
- **Avatar:** Digital companion display
- **Themes:** Light, Dark, Blue, Green, Purple
- **Dream Weaving:** Monitor and control self-evolution
- **Sigil Explorer:** View cryptographic proofs
- **Settings:** Configure model, UI, and API options

---

## Quest 3 Setup

Quest 3 integration requires additional SDKs and setup. See [docs/QUEST_SDK_REQUIREMENTS.md](docs/QUEST_SDK_REQUIREMENTS.md) for detailed instructions.

### Quick Start (Windows)

#### Step 1: Install Quest SDKs

Run `setup-quest-sdk.bat` to set up environment variables.

**Manual Installation Required:**

1. **Android Studio:** Install from https://developer.android.com/studio
2. **Android SDK/NDK:** Install via Android Studio SDK Manager
3. **Quest SDK:** Download from https://developer.oculus.com/downloads/package/occulus-mobile-sdk/
4. **OpenXR:** Download from https://github.com/KhronosGroup/OpenXR-SDK/releases

#### Step 2: Enable Developer Mode on Quest 3

1. Open Meta Quest app on phone
2. Menu → Devices → Select Quest 3
3. Scroll down to "Developer Mode"
4. Toggle ON
5. Confirm your account

#### Step 3: Connect Quest 3

1. Connect Quest 3 via USB-C cable
2. Put on headset
3. Settings → System → Developer
4. Enable "USB Connection"
5. Select "File Transfer" or "ADB"
6. Allow USB debugging when prompted

#### Step 4: Verify Connection

```bash
adb devices
```

Should show your Quest 3 device ID.

#### Step 5: Install Rust Android Targets

```bash
rustup target add aarch64-linux-android
cargo install cargo-apk
```

#### Step 6: Build Quest App

```bash
cd quest-integration
cargo apk build
```

#### Step 7: Deploy to Quest 3

```bash
cargo apk install
```

#### Step 8: Test on Quest 3

1. Put on Quest 3 headset
2. Open Library → Unknown Sources
3. Launch SIGIL OS
4. Test features:
   - Voice input
   - Hand tracking
   - Passthrough mode
   - Spatial anchors
   - Avatar rendering

---

## Configuration

### Configuration File Location

**Windows:** `%APPDATA%\SIGIL-OS\config.yaml`

**Linux:** `~/.config/sigil-os/config.yaml`

**macOS:** `~/Library/Application Support/SIGIL-OS/config.yaml`

### Default Configuration

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
  enabled: false
  auto_connect: true

# API Configuration
api:
  host: "127.0.0.1"
  port: 8080
  enable_cors: true
```

### Configuration Options

#### Model Configuration

- `provider`: "local" or "cloud"
- `model_name`: Name of the model to use
- `model_path`: Path to model weights
- `download_if_missing`: Automatically download model if not found

#### UI Configuration

- `theme`: "light", "dark", "blue", "green", "purple"
- `icon_pack`: "default" or custom pack name
- `avatar_style`: "realistic", "stylized", "procedural"

#### Dream Weaving Configuration

- `enabled`: Enable/disable Dream Weaving
- `max_generations`: Maximum dream cycles per session
- `auto_approve_mutations`: Automatically approve evolutions

#### Quest 3 Configuration

- `enabled`: Enable Quest 3 integration
- `auto_connect`: Automatically connect to Quest device

#### API Configuration

- `host`: API server host address
- `port`: API server port
- `enable_cors`: Enable CORS for web UI

---

## Verification

### Step 1: Check API Server Health

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

### Step 2: Test Chat Endpoint

```bash
curl -X POST http://127.0.0.1:8080/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, SIGIL OS!"}'
```

Expected response:
```json
{
  "response": "Response to: Hello, SIGIL OS! (from qwen-7b)",
  "tokens_generated": 42,
  "duration_ms": 123
}
```

### Step 3: Verify Database

**Windows:**
```powershell
dir "%LOCALAPPDATA%\SIGIL-OS"
```

**Linux/macOS:**
```bash
ls ~/.local/share/sigil-os
```

Should show `sigil.db` database file.

### Step 4: Check Logs

The API server logs to console. Check for:
- `[INFO]` messages for successful operations
- `[ERROR]` messages for issues
- `[WARN]` messages for warnings

---

## Troubleshooting

### Build Errors

#### Error: "cannot find -lsqlite3"

**Solution:** Install SQLite development libraries

**Windows:** Included with Visual Studio Build Tools

**Linux:**
```bash
sudo apt install libsqlite3-dev  # Ubuntu/Debian
sudo dnf install sqlite-devel  # Fedora
```

**macOS:**
```bash
brew install sqlite3
```

#### Error: "Failed to compile candle"

**Solution:** Candle v0.11.0 should work without issues. If you encounter errors:

1. Update Rust:
```bash
rustup update stable
```

2. Clean build:
```bash
cargo clean
cargo build --release
```

3. Check specific error message and report as issue

### Runtime Errors

#### Error: "Model not found"

**Solution:** Download model weights or configure `download_if_missing: true` in config.yaml

#### Error: "Permission denied"

**Solution:** Ensure user has write permissions to configuration directory

**Windows:** Run as Administrator

**Linux/macOS:**
```bash
chmod +w ~/.config/sigil-os
```

#### Error: "Port 8080 already in use"

**Solution:** Change port in config.yaml or stop the process using port 8080

**Windows:**
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Linux/macOS:**
```bash
lsof -ti:8080 | xargs kill -9
```

### Quest 3 Issues

#### Error: "ADB not recognizing device"

**Solution:**
```bash
adb kill-server
adb start-server
adb devices
```

Try different USB cable or port

#### Error: "NDK not found"

**Solution:**
```bash
echo $ANDROID_NDK_HOME
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
```

#### Error: "Permission denied errors"

**Solution:** Grant USB debugging permission on Quest 3:
- Settings → System → Developer → USB Debugging → Allow

### UI Issues

#### Error: "Slint initialization failed"

**Solution:** Ensure graphics drivers are up to date. Slint requires OpenGL or Vulkan support.

**Windows:** Update GPU drivers from manufacturer website

**Linux:**
```bash
sudo apt install mesa-vulkan-drivers  # Ubuntu/Debian
```

**macOS:** Update macOS to latest version

---

## Next Steps

After successful installation:

1. **Read the User Manual:** [USER_MANUAL.md](USER_MANUAL.md)
2. **Configure Your Model:** Download Qwen 7B model or use placeholder
3. **Explore Dream Weaving:** Enable and configure self-evolution
4. **Set Up Quest 3:** Follow Quest 3 setup guide if you have a headset
5. **Customize UI:** Choose your preferred theme and avatar style
6. **Join the Community:** Report issues, contribute, or ask questions

### Development

If you want to contribute to SIGIL OS:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Set up development environment
3. Fork the repository
4. Create a feature branch
5. Make your changes
6. Run tests
7. Submit a Pull Request

---

## Support

- **GitHub Issues:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues
- **Documentation:** https://github.com/fuzzynetwork1989-alt/SIGIL-OS/tree/main/docs
- **Discord:** (Coming soon)

---

## License

SIGIL OS is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the SIGIL OS team**
