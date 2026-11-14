# SIGIL OS Complete Setup Guide

**Version:** 1.0.0
**Last Updated:** 2026-10-23
**Platform Coverage:** Desktop (Electron), Mobile (Android Expo), Meta Quest 3, Web UI

---

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Prerequisites Installation](#prerequisites-installation)
4. [Desktop Setup (Electron)](#desktop-setup-electron)
5. [Mobile Setup (Android APK with Expo)](#mobile-setup-android-apk-with-expo)
6. [Meta Quest 3 Setup](#meta-quest-3-setup)
7. [Web UI/UX Setup](#web-uiux-setup)
8. [API Server Setup](#api-server-setup)
9. [Model Download and Setup](#model-download-and-setup)
10. [Running All Services](#running-all-services)
11. [Troubleshooting](#troubleshooting)
12. [Deployment Guide](#deployment-guide)

---

## Overview

SIGIL OS is a Post-AI Operating System with Cryptographic Warrant. This guide will walk you through setting up all components:

- **Desktop Client** (Electron-based) - Windows, macOS, Linux

- **Mobile Client** (Expo/React Native) - Android APK

- **Meta Quest 3** - Mixed Reality integration

- **Web UI** - Browser-based interface

- **API Server** - Rust-based backend

- **AI Model** - Qwen 7B local inference

---

## System Requirements

### Minimum Requirements (All Platforms)

- **CPU:** 4 cores

- **RAM:** 8GB

- **Storage:** 50GB free space

- **Network:** Stable internet connection

### Recommended Requirements

- **CPU:** 8 cores

- **RAM:** 16GB

- **Storage:** 100GB SSD

- **Network:** High-speed internet

### GPU Requirements (for local AI inference)

- **GPU:** NVIDIA GPU with 8GB+ VRAM (recommended)

- **CUDA:** Version 11.0 or higher

- **Drivers:** Latest NVIDIA drivers

### Platform-Specific Requirements

#### Desktop (Windows)

- Windows 10 or later

- Visual Studio Build Tools (for native compilation)

- Node.js 18+

- Python 3.9+

#### Desktop (macOS)

- macOS 11.0+ (Big Sur or later)

- Xcode Command Line Tools

- Node.js 18+

- Python 3.9+

#### Desktop (Linux)

- Ubuntu 20.04+, Debian 11+, or equivalent

- Build-essential packages

- Node.js 18+

- Python 3.9+

#### Mobile (Android Development)

- Android Studio (for SDK/NDK)

- Java JDK 11+

- Android SDK API Level 33+

- Android NDK r25+

#### Meta Quest 3

- Quest 3 device

- Developer Mode enabled

- Android Studio (for SDK/NDK)

- OpenXR SDK

- Quest SDK

---

## Prerequisites Installation

### Step 1: Install Rust (Required for API Server)

**Windows:**

```powershell
# Download and run rustup-init.exe
# Visit: <https://rustup.rs/>
# Or use PowerShell:
Invoke-WebRequest -Uri <https://win.rustup.rs/x86_64> -OutFile rustup-init.exe
.\rustup-init.exe

# After installation, restart terminal
rustc --version
cargo --version
```

**macOS:**

```bash
curl --proto '=https' --tlsv1.2 -sSf <https://sh.rustup.rs> | sh
source $HOME/.cargo/env
rustc --version
cargo --version
```

**Linux:**

```bash
curl --proto '=https' --tlsv1.2 -sSf <https://sh.rustup.rs> | sh
source $HOME/.cargo/env
rustc --version
cargo --version
```

### Step 2: Install Node.js (Required for Desktop, Mobile, Web)

**Windows:**

```powershell
# Download from <https://nodejs.org/>
# Install LTS version (18.x or later)
node --version
npm --version
```

**macOS (using Homebrew):**

```bash
brew install node
node --version
npm --version
```

**Linux (Ubuntu/Debian):**

```bash
curl -fsSL <https://deb.nodesource.com/setup_18.x> | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### Step 3: Install Git

**Windows:**

```powershell
# Download from <https://git-scm.com/>
# Or use winget:
winget install Git.Git
git --version
```

**macOS:**

```bash
brew install git
git --version
```

**Linux:**

```bash
sudo apt update
sudo apt install git
git --version
```

### Step 4: Install Python (Required for model tokenizer)

**Windows:**

```powershell
# Download from <https://python.org/>
# Install Python 3.9 or later
python --version
pip --version
```

**macOS:**

```bash
brew install python@3.9
python3 --version
pip3 --version
```

**Linux:**

```bash
sudo apt update
sudo apt install python3 python3-pip
python3 --version
pip3 --version
```

### Step 5: Install Python Dependencies

```bash
pip install transformers tiktoken
```

### Step 6: Clone the Repository

```bash
git clone <https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git>
cd SIGIL-OS
```

---

## Desktop Setup (Electron)

### Desktop Overview

The desktop client uses Electron instead of Tauri for cross-platform compatibility.

### Step 1: Install Electron Dependencies

```bash
cd desktop-client
npm install
```

### Step 2: Configure Electron

If the Electron setup doesn't exist, initialize it:

```bash
# Install Electron
npm install --save-dev electron electron-builder

# Create main process file
touch main.js
```

### Step 3: Create Electron Main Process

Create `desktop-client/main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the React app
  win.loadURL('<http://localhost:5173'>);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### Step 4: Update package.json

Add Electron scripts to `desktop-client/package.json`:

```json
{
  "main": "main.js",
  "scripts": {
    "electron": "electron .",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on <http://localhost:5173> && electron .\"",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.sigil-os.desktop",
    "productName": "SIGIL OS",
    "directories": {
      "output": "dist"
    },
    "files": [
      "dist/**/*",
      "main.js"
    ],
    "win": {
      "target": ["nsis"]
    },
    "mac": {
      "target": ["dmg"]
    },
    "linux": {
      "target": ["AppImage"]
    }
  }
}
```

### Step 5: Install Additional Dependencies

```bash
npm install --save-dev concurrently wait-on electron-builder
```

```bash
npm install --save-dev concurrently wait-on electron-builder
```

### Step 6: Run Desktop Client (Development)

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Electron
npm run electron:dev
```

### Step 7: Build Desktop Client (Production)

```bash
npm run electron:build
```

The installer will be in `desktop-client/dist/`:

- Windows: `SIGIL OS Setup 1.0.0.exe`

- macOS: `SIGIL OS-1.0.0.dmg`

- Linux: `SIGIL OS-1.0.0.AppImage`

---

## Mobile Setup (Android APK with Expo)

### Mobile Overview

The mobile client uses Expo for React Native development and building.

### Step 1: Install Expo CLI

```bash
npm install -g expo-cli
# Or use npx (recommended)
npx create-expo-app
```

### Step 2: Setup Mobile Client

```bash
cd mobile-client
npm install
```

### Step 3: Install Required Expo Dependencies

```bash
# Install core dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Install Expo dependencies
npx expo install expo-status-bar expo-av expo-sensors
```

### Step 4: Configure App.json

Update `mobile-client/app.json`:

```json
{
  "expo": {
    "name": "SIGIL OS",
    "slug": "sigil-os",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.sigil-os.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.sigil-os.mobile",
      "permissions": [
        "INTERNET",
        "RECORD_AUDIO",
        "CAMERA"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Step 5: Create App Entry Point

Create `mobile-client/App.js`:

```javascript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGIL OS Mobile</Text>
      <Text style={styles.subtitle}>Your AI Companion</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
```

### Step 6: Run Mobile App (Development)

```bash
# Start Expo development server
npx expo start

# Options:
# - Press 'a' to run on Android emulator
# - Press 'i' to run on iOS simulator
# - Scan QR code with Expo Go app on physical device
```

### Step 7: Build Android APK (Production)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build for production (Play Store)
eas build --platform android --profile production
```

The APK will be available in the Expo dashboard or downloaded locally.

### Step 8: Install APK on Device

```bash
# Install via ADB (if connected via USB)
adb install path/to/app.apk

# Or transfer APK to device and install manually
```

---

## Meta Quest 3 Setup

### Quest Overview

Meta Quest 3 integration requires the Meta Quest SDK and OpenXR.

### Step 1: Enable Developer Mode on Quest 3

1. Open the Meta Quest mobile app
2. Go to Settings → Your headset
3. Enable "Developer Mode"
4. Accept the warning

### Step 2: Install Android Studio

Download and install Android Studio from: <https://developer.android.com/studio>

**Windows:**

```powershell
# Download installer from website
# Run installer with default settings
```

**macOS:**

```bash
brew install --cask android-studio
```

**Linux:**

```bash
# Download from website
# Extract and run studio.sh
```

### Step 3: Install Android SDK and NDK

1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install:
   - Android SDK Platform 33
   - Android SDK Build-Tools 33.0.0
   - Android NDK (Side by side) r25c
   - CMake

### Step 4: Install Quest SDK

1. Download Meta Quest SDK from: <https://developer.oculus.com/downloads/package/>
2. Extract to a known location (e.g., `C:/QuestSDK`)
3. Set environment variable:

```powershell
# Windows
setx QUEST_SDK "C:/QuestSDK"
```

### Step 5: Install OpenXR

1. Download OpenXR loader from: <https://github.com/KhronosGroup/OpenXR-SDK/releases>
2. Extract and install
3. Add to PATH:

```powershell
setx PATH "%PATH%;C:/OpenXR/bin"
```

### Step 6: Setup Quest Integration Project

```bash
cd quest-integration
```

### Step 7: Configure Quest Project

Update `quest-integration/Cargo.toml`:

```toml
[package]
name = "quest-integration"
version = "0.1.0"
edition = "2021"

[dependencies]
# Add OpenXR and Quest dependencies
openxr = "0.17"
```

### Step 8: Build Quest App

```bash
cargo build --release
```

### Step 9: Deploy to Quest 3

```bash
# Enable ADB over Wi-Fi in Quest Developer Hub
# Get Quest IP address from headset settings

# Connect via ADB
adb connect <QUEST_IP>:5555

# Install APK
adb install target/release/quest-integration.apk

# Launch app
adb shell am start -n com.sigil-os.quest/.MainActivity
```

### Step 10: Verify Installation

1. Put on Quest 3 headset
2. Open Apps Library
3. Find "SIGIL OS"
4. Launch and test features

---

## Web UI/UX Setup

### Web Overview

The web UI uses Vite + React for fast development and modern styling.

### Step 1: Install Web Dependencies

```bash
cd desktop-client  # Web UI is shared with desktop client
npm install
```

### Step 2: Configure Vite

Update `desktop-client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
});
```

### Step 3: Run Web UI (Development)

```bash
npm run dev
```

Access at: <http://localhost:5173>

### Step 4: Build Web UI (Production)

```bash
npm run build
```

Output will be in `desktop-client/dist/`

### Step 5: Deploy Web UI

**Option 1: Static hosting (Vercel/Netlify)**

```bash
# Vercel
npm install -g vercel
vercel

# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 2: GitHub Pages**

```bash
# Update vite.config.ts
base: '/SIGIL-OS/',

# Build
npm run build

# Deploy to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

---

## API Server Setup

### Step 1: Build API Server

```bash
# From project root
cargo build --release
```

### Step 2: Configure API Server

Create config file at `%APPDATA%\SIGIL-OS\config.yaml` (Windows) or `~/.config/sigil-os/config.yaml` (Linux/macOS):

```yaml
# SIGIL OS Configuration

# Model Configuration
model:
  provider: "local"
  model_name: "qwen-7b"
  model_path: "C:/Users/YOUR_USERNAME/.sigil-os/models/qwen-7b"
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

### Step 3: Run API Server

```bash
# From project root
./target/release/api.exe  # Windows
./target/release/api     # Linux/macOS
```

### Step 4: Verify API Server

```bash
curl <http://localhost:8080/health>
```

Expected response:

```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-10-23T10:00:00Z",
  "superbrain_enabled": true
}
```

---

## Model Download and Setup

### Step 1: Create Model Directory

```bash
# Windows
mkdir -p "C:/Users/YOUR_USERNAME/.sigil-os/models"

# Linux/macOS
mkdir -p ~/.sigil-os/models
```

### Step 2: Download Qwen 7B Model

**Option 1: Using Hugging Face CLI**

```bash
pip install huggingface_hub
huggingface-cli download Qwen/Qwen-7B --local-dir "C:/Users/YOUR_USERNAME/.sigil-os/models/qwen-7b"
```

**Option 2: Using Python script**

```python
from huggingface_hub import snapshot_download

model_path = snapshot_download(
    repo_id="Qwen/Qwen-7B",
    local_dir="C:/Users/YOUR_USERNAME/.sigil-os/models/qwen-7b",
    local_dir_use_symlinks=False
)

print(f"Model downloaded to: {model_path}")
```

**Option 3: Manual download**

1. Visit: <https://huggingface.co/Qwen/Qwen-7B>
2. Download all files manually
3. Place in model directory

### Step 3: Export Tokenizer

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen-7B", trust_remote_code=True)
tokenizer.save_pretrained("C:/Users/YOUR_USERNAME/.sigil-os/models/qwen-tokenizer")

print("Tokenizer exported successfully")
```

### Step 4: Verify Model Files

```bash
# Check model directory
ls "C:/Users/YOUR_USERNAME/.sigil-os/models/qwen-7b"

# Should see:
# - config.json
# - model-00001-of-00008.safetensors (or similar)
# - tokenizer.json
# - tokenizer_config.json
# - etc.
```

### Step 5: Update API Config

Update `config.yaml` with correct model path:

```yaml
model:
  model_path: "C:/Users/YOUR_USERNAME/.sigil-os/models/qwen-7b"
```

---

## Running All Services

### Complete Startup Sequence

#### Terminal 1: API Server

```bash
cd "C:\Users\Corey Smith\Devin Projects\SIGIL OS"
./target/release/api.exe
```

#### Terminal 2: Web UI

```bash
cd desktop-client
npm run dev
```

#### Terminal 3: Desktop Client (Optional)

```bash
cd desktop-client
npm run electron:dev
```

#### Terminal 4: Mobile Client (Optional)

```bash
cd mobile-client
npx expo start
```

### Verify All Services

1. **API Server:** <http://localhost:8080/health>
2. **Web UI:** <http://localhost:5173>
3. **Desktop App:** Electron window should open
4. **Mobile App:** Use Expo Go or installed APK

---

## Troubleshooting

### Common Issues

#### Issue: "Rust not found"

##### Solution

```bash
# Reinstall Rust
curl --proto '=https' --tlsv1.2 -sSf <https://sh.rustup.rs> | sh
source $HOME/.cargo/env
```

#### Issue: "Node.js not found"

##### Solution

```bash
# Reinstall Node.js
# Download from <https://nodejs.org/>
# Or use version manager:
nvm install 18
nvm use 18
```

#### Issue: "Port 8080 already in use"

##### Solution

```bash
# Windows (PowerShell)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8080
kill -9 <PID>
```

#### Issue: "Model not found"

##### Solution

```bash
# Verify model path
ls ~/.sigil-os/models/qwen-7b

# Update config.yaml with correct path
# Restart API server
```

#### Issue: "Electron build fails"

##### Solution

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Rebuild
npm run electron:build
```

#### Issue: "Expo build fails"

##### Solution

```bash
# Clear Expo cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
eas build --platform android
```

#### Issue: "Quest 3 not connecting"

##### Solution

```bash
# Check ADB connection
adb devices

# Enable Developer Mode on headset
# Enable ADB over Wi-Fi in Developer Hub
# Reconnect with headset IP
adb connect <QUEST_IP>:5555
```

### Getting Help

- Check logs in each terminal

- Verify all prerequisites are installed

- Ensure correct versions of dependencies

- Check GitHub Issues: <https://github.com/fuzzynetwork1989-alt/SIGIL-OS/issues>

---

## Deployment Guide

### Desktop Deployment

#### Windows

```bash
cd desktop-client
npm run electron:build
# Output: dist/SIGIL OS Setup 1.0.0.exe
```

#### macOS

```bash
cd desktop-client
npm run electron:build
# Output: dist/SIGIL OS-1.0.0.dmg
```

#### Linux

```bash
cd desktop-client
npm run electron:build
# Output: dist/SIGIL OS-1.0.0.AppImage
```

### Mobile Deployment

#### Android APK

```bash
cd mobile-client
eas build --platform android --profile production
# Download APK from Expo dashboard
```

#### Google Play Store

```bash
eas submit --platform android --latest
```

### Web Deployment

#### Vercel

```bash
cd desktop-client
npm run build
vercel --prod
```

#### Netlify

```bash
cd desktop-client
npm run build
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```bash
cd desktop-client
npm run build
gh-pages -d dist
```

### Quest 3 Deployment

#### Side-loading

```bash
# Build APK
cd quest-integration
cargo build --release

# Install via ADB
adb install target/release/quest-integration.apk
```

#### Meta Quest Store

1. Create developer account at <https://developer.oculus.com/>
2. Submit app for review
3. Wait for approval
4. Publish to store

---

## Summary

This guide covers:

✅ **Desktop Setup** - Electron-based cross-platform app
✅ **Mobile Setup** - Android APK with Expo
✅ **Quest 3 Setup** - Mixed Reality integration
✅ **Web UI** - Browser-based interface
✅ **API Server** - Rust backend
✅ **Model Setup** - Qwen 7B local inference

### Quick Reference

```bash
# Install prerequisites
curl --proto '=https' --tlsv1.2 -sSf <https://sh.rustup.rs> | sh
npm install -g node

# Clone repo
git clone <https://github.com/fuzzynetwork1989-alt/SIGIL-OS.git>
cd SIGIL-OS

# Build API
cargo build --release

# Start API
./target/release/api.exe

# Start Web UI
cd desktop-client
npm run dev

# Start Desktop
npm run electron:dev

# Start Mobile
cd mobile-client
npx expo start

# Build Quest
cd quest-integration
cargo build --release
```

---

## Next Steps

- Read [USER_MANUAL.md](USER_MANUAL.md) for feature documentation

- Read [ARCHITECTURE.md](docs/ARCHITECTURE.md) for technical details

- Join GitHub Discussions for community support

- Report issues on GitHub Issues

---

**Last Updated:** 2026-10-23
**Maintained by:** SIGIL OS Team
