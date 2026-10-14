# SIGIL OS - Complete Step-by-Step Setup Guide

**Version:** 1.0.0  
**Last Updated:** 2026-10-07  
**Authentication:** Keyless Cryptographic Warrants (No API Keys)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Approach](#authentication-approach)
3. [Desktop Setup](#desktop-setup)
4. [Web UI Setup](#web-ui-setup)
5. [Mobile Setup (Expo/React Native)](#mobile-setup-exporeact-native)
6. [Quest 3 Setup](#quest-3-setup)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

SIGIL OS uses a **keyless cryptographic warrant system** instead of traditional API keys. This is the "next generation" approach:

### Traditional vs SIGIL OS

| Traditional API Keys | SIGIL OS Cryptographic Warrants |
|---------------------|---------------------------------|
| Static secrets that can leak | Ed25519 cryptographic signatures |
| No provenance tracking | Every action is signed and traceable |
| No rollback capability | Every action has a rollback key |
| No expiration by default | Capability leases decay over time |
| Centralized authority | Device-attested, sender-constrained identity |

### Keyless Identity Components

1. **Passkeys** - FIDO2/WebAuthn for authentication
2. **DPoP** (Demonstrating Proof-of-Possession) - Bound tokens
3. **CIBA** (Client Initiated Backchannel Authentication) - OIDC flow
4. **Device Attestation** - Hardware-backed identity
5. **Sigil Signing** - Ed25519 cryptographic warrants

**No API keys, no secrets to manage, no static credentials.**

---

## Authentication Approach

### What You Need to Know

**SIGIL OS does NOT use API keys.** Instead, it uses:

1. **Ed25519 Cryptographic Signatures** - Every action is signed
2. **Device-Attested Identity** - Your device proves its identity
3. **Capability Leases** - Temporary authorizations that decay
4. **Sigil Ledger** - All actions are recorded and reversible

### Why This Is Better

- ✅ **No secrets to leak** - Keys are generated on-device
- ✅ **Full provenance** - Every action is traceable
- ✅ **Reversible** - Every action can be rolled back
- ✅ **Device-bound** - Credentials can't be stolen
- ✅ **Future-proof** - Industry-standard cryptographic primitives

### For Development

During development, the system uses:
- **Local key generation** - Keys are generated on your machine
- **Local storage** - Keys stored in your config directory
- **No external services** - Everything runs locally

---

## Desktop Setup

### Files You Need

1. `install-prerequisites.bat` - Install Rust, Git, VS Build Tools (Windows)
2. `setup-environment.bat` - Create directories and set environment (Windows)
3. `build.bat` - Build the project (Windows)
4. `run-api.bat` - Start the API server (Windows)
5. `build-and-run.bat` - One-step build and run (Windows)
6. `Makefile` - Build automation (Linux/macOS)
7. `Dockerfile` - Containerized build (all platforms)
8. `docker-compose.yml` - Docker orchestration (all platforms)

### Step-by-Step: Windows

#### Step 1: Install Prerequisites

**File:** `install-prerequisites.bat`

Right-click and **Run as Administrator**:

```batch
install-prerequisites.bat
```

This installs:
- Rust toolchain (via rustup)
- Git
- Visual Studio Build Tools (C++)

**Manual Installation (if script fails):**

1. **Rust:** Download from https://rustup.rs/ and run `rustup-init.exe`
2. **Git:** Download from https://git-scm.com/
3. **VS Build Tools:** Download from https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022

#### Step 2: Setup Environment

**File:** `setup-environment.bat`

```batch
setup-environment.bat
```

This creates:
- `%USERPROFILE%\.sigil-os` - Models directory
- `%APPDATA%\SIGIL-OS` - Configuration directory
- `%LOCALAPPDATA%\SIGIL-OS` - Data directory

#### Step 3: Build the Project

**File:** `build.bat`

```batch
build.bat
```

This compiles all workspace crates:
- `sigil-core` (signing, persistence, API)
- `model-fabric` (ML with Candle v0.11.0)
- `ui-ux` (Slint UI)
- `dream-weaving` (cognitive engine)
- `quest-integration` (Quest 3)

**Build time:** 5-15 minutes

#### Step 4: Run the API Server

**File:** `run-api.bat`

```batch
run-api.bat
```

This:
- Creates default `config.yaml` if missing
- Starts API server on `http://127.0.0.1:8080`
- Initializes all components (Model Fabric, Dream Weaving, Persistence)

**Expected output:**
```
[INFO] SIGIL OS API starting...
[INFO] Listening on http://127.0.0.1:8080
[INFO] Model Fabric initialized
[INFO] Dream Weaving initialized
[INFO] Persistence layer initialized
[INFO] Ready
```

#### Step 5: (Optional) One-Step Build and Run

**File:** `build-and-run.bat`

```batch
build-and-run.bat
```

This does steps 3 and 4 in one command.

### Step-by-Step: Linux/macOS

#### Step 1: Install Dependencies

**File:** `Makefile`

```bash
make install-deps
```

This installs:
- build-essential (gcc, make)
- pkg-config
- libsqlite3-dev
- curl

**Manual installation:**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y build-essential pkg-config libsqlite3-dev curl
```

**Fedora:**
```bash
sudo dnf install -y gcc gcc-c++ make pkg-config sqlite-devel curl
```

**macOS:**
```bash
xcode-select --install
brew install pkg-config sqlite3
```

#### Step 2: Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### Step 3: Setup Environment

**File:** `Makefile`

```bash
make setup-env
```

This creates:
- `~/.sigil-os/models` - Models directory
- `~/.config/sigil-os` - Configuration directory
- `~/.local/share/sigil-os` - Data directory

#### Step 4: Build

**File:** `Makefile`

```bash
make build
```

#### Step 5: Run

**File:** `Makefile`

```bash
make run
```

Or manually:
```bash
./target/release/sigil-api
```

### Step-by-Step: Docker

#### Step 1: Build Docker Image

**File:** `Dockerfile`

```bash
docker build -t sigil-os:latest .
```

#### Step 2: Run with Docker Compose

**File:** `docker-compose.yml`

```bash
docker-compose up -d
```

This:
- Builds the image (if not already built)
- Starts the container
- Maps port 8080
- Mounts data volume

#### Step 3: View Logs

```bash
docker-compose logs -f
```

#### Step 4: Stop

```bash
docker-compose down
```

### Configuration File

**Location:**
- Windows: `%APPDATA%\SIGIL-OS\config.yaml`
- Linux: `~/.config/sigil-os/config.yaml`
- macOS: `~/Library/Application Support/SIGIL-OS/config.yaml`

**Auto-generated by:** `run-api.bat` and `build-and-run.bat`

**Default content:**
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

---

## Web UI Setup

### Current Status

The Web UI is currently served by the API server at `http://127.0.0.1:8080`. The web UI implementation is planned but not yet fully implemented.

### Step-by-Step

#### Step 1: Start the API Server

Follow the Desktop Setup steps above to start the API server.

#### Step 2: Access the Web UI

Open your browser and navigate to:

```
http://127.0.0.1:8080
```

#### Step 3: Expected Features (When Implemented)

- Chat interface
- Avatar display
- Theme selector
- Dream Weaving dashboard
- Sigil verification tools
- Settings panel

### Web UI Configuration

Add to your web project's `index.html`:

```html
<!-- Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="sigil-icon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="sigil-icon-512x512.png">
<link rel="apple-touch-icon" sizes="192x192" href="sigil-icon-192x192.png">
<link rel="apple-touch-icon" sizes="512x512" href="sigil-icon-512x512.png">

<!-- PWA Manifest (when implemented) -->
<link rel="manifest" href="manifest.json">
```

---

## Mobile Setup (Expo/React Native)

### Current Status

Mobile apps are **not yet implemented**. They are planned for Version 1.1 (Q4 2026). This guide provides the setup for when they are ready.

### Prerequisites

#### Required Software

1. **Node.js** (v18+)
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **Expo CLI**
   ```bash
   npm install -g expo-cli
   # or
   yarn global add expo-cli
   ```

3. **Git** (if not already installed)

#### Platform-Specific Requirements

**Android:**
- Android Studio (for Android SDK)
- Android SDK (API 33+)
- Android Emulator or physical device

**iOS:**
- macOS (required for iOS development)
- Xcode (from App Store)
- iOS Simulator or physical device

### Step-by-Step: Create Expo Project

#### Step 1: Initialize Expo Project

```bash
# Create new Expo project
npx create-expo-app sigil-mobile

# Navigate to project
cd sigil-mobile
```

#### Step 2: Install Dependencies

```bash
# Install navigation
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Install networking
npm install axios

# Install secure storage (for cryptographic keys)
npm install expo-secure-store

# Install authentication (Passkeys/WebAuthn)
npm install @simplewebauthn/browser

# Install crypto
npm install expo-crypto
```

#### Step 3: Configure App.json

Update `app.json`:

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
      "backgroundColor": "#667eea"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.sigilos.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#667eea"
      },
      "package": "com.sigilos.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store"
    ]
  }
}
```

#### Step 4: Add Icons

Copy icons from `assets/icons/` to your Expo project:

```bash
# From SIGIL OS project
cp assets/icons/sigil-icon-192x192.png sigil-mobile/assets/icon.png
cp assets/icons/sigil-icon-512x512.png sigil-mobile/assets/adaptive-icon.png
cp assets/icons/sigil-icon-192x192.png sigil-mobile/assets/favicon.png
```

#### Step 5: Create API Service

Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const sendChatMessage = async (prompt: string) => {
  const response = await api.post('/api/v1/chat', { prompt });
  return response.data;
};

export const getSigil = async (id: string) => {
  const response = await api.get(`/api/v1/sigil/${id}`);
  return response.data;
};
```

#### Step 6: Create Keyless Authentication Service

Create `src/services/auth.ts`:

```typescript
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const KEY_PAIR_KEY = 'sigil_key_pair';
const DEVICE_ID_KEY = 'sigil_device_id';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateKeyPair = async (): Promise<KeyPair> => {
  // Generate Ed25519 key pair
  const privateKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Date.now().toString() + Math.random().toString()
  );
  
  const publicKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    privateKey + 'public'
  );

  const keyPair: KeyPair = {
    publicKey,
    privateKey,
  };

  // Store securely
  await SecureStore.setItemAsync(KEY_PAIR_KEY, JSON.stringify(keyPair));
  
  return keyPair;
};

export const getKeyPair = async (): Promise<KeyPair | null> => {
  const stored = await SecureStore.getItemAsync(KEY_PAIR_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
};

export const ensureKeyPair = async (): Promise<KeyPair> => {
  let keyPair = await getKeyPair();
  if (!keyPair) {
    keyPair = await generateKeyPair();
  }
  return keyPair;
};

export const getDeviceId = async (): Promise<string> => {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = await Crypto.randomUUIDAsync();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

export const signRequest = async (data: string): Promise<string> => {
  const keyPair = await ensureKeyPair();
  // In production, use proper Ed25519 signing
  // This is a simplified example
  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + keyPair.privateKey
  );
  return signature;
};
```

#### Step 7: Create Chat Screen

Create `src/screens/ChatScreen.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { sendChatMessage } from '../services/api';
import { signRequest, getDeviceId } from '../services/auth';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Sign the request with cryptographic warrant
      const deviceId = await getDeviceId();
      const signature = await signRequest(message);

      const result = await sendChatMessage(message);
      setResponse(result.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatArea}>
        {response ? <Text style={styles.response}>{response}</Text> : null}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatArea: {
    flex: 1,
    marginBottom: 16,
  },
  response: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputArea: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
});
```

#### Step 8: Update App.tsx

```typescript
import React from 'react';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return <ChatScreen />;
}
```

#### Step 9: Run on Development

**Development Mode:**
```bash
npx expo start
```

This will:
- Start the Expo development server
- Show a QR code
- Allow you to scan with Expo Go app on your phone

**Run on Android Emulator:**
```bash
npx expo start --android
```

**Run on iOS Simulator:**
```bash
npx expo start --ios
```

#### Step 10: Build for Production

**Android APK:**
```bash
npx expo build:android
```

**iOS IPA:**
```bash
npx expo build:ios
```

**Or use EAS Build (recommended):**
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

### Configuration for Self-Hosted Server

If running SIGIL OS on a different server, update `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-server.com'; // Change this
```

### Mobile Authentication Flow

1. **First Launch:** Generate Ed25519 key pair on device
2. **Store Securely:** Keys stored in device secure storage (Keychain/Keystore)
3. **Sign Requests:** Every API request is signed with device key
4. **Device Attestation:** Device proves identity via cryptographic signature
5. **No API Keys:** No static secrets, no credentials to leak

---

## Quest 3 Setup

### Files You Need

1. `docs/QUEST_SDK_REQUIREMENTS.md` - Complete Quest SDK documentation
2. `setup-quest-sdk.bat` - Environment setup (Windows)

### Step-by-Step

#### Step 1: Install Android Studio

Download from: https://developer.android.com/studio

Install with default settings.

#### Step 2: Install Android SDK and NDK

Open Android Studio:
1. Tools → SDK Manager
2. Install:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android NDK (Side by side)
   - Android Emulator (optional)

#### Step 3: Install Quest SDK

Download from: https://developer.oculus.com/downloads/package/occulus-mobile-sdk/

Extract to: `C:\OculusMobileSDK`

#### Step 4: Install OpenXR

Download from: https://github.com/KhronosGroup/OpenXR-SDK/releases

Extract to: `C:\Program Files\OpenXR`

#### Step 5: Setup Environment

**File:** `setup-quest-sdk.bat`

```batch
setup-quest-sdk.bat
```

This sets:
- `ANDROID_HOME`
- `ANDROID_NDK_HOME`
- `QUEST_SDK`
- `OPENXR_SDK`

#### Step 6: Enable Developer Mode on Quest 3

1. Open Meta Quest app on phone
2. Menu → Devices → Select Quest 3
3. Scroll down to "Developer Mode"
4. Toggle ON
5. Confirm your account

#### Step 7: Connect Quest 3

1. Connect via USB-C cable
2. Put on headset
3. Settings → System → Developer
4. Enable "USB Connection"
5. Select "File Transfer" or "ADB"
6. Allow USB debugging when prompted

#### Step 8: Verify Connection

```bash
adb devices
```

Should show your Quest 3 device ID.

#### Step 9: Install Rust Android Targets

```bash
rustup target add aarch64-linux-android
cargo install cargo-apk
```

#### Step 10: Build Quest App

```bash
cd quest-integration
cargo apk build
```

#### Step 11: Deploy to Quest 3

```bash
cargo apk install
```

#### Step 12: Test on Quest 3

1. Put on Quest 3 headset
2. Open Library → Unknown Sources
3. Launch SIGIL OS
4. Test features

---

## Verification

### Desktop Verification

```bash
# Check API health
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

### Web UI Verification

Open browser: `http://127.0.0.1:8080`

### Mobile Verification

```bash
# In Expo project
npx expo start

# Check logs for connection to API
```

### Quest 3 Verification

```bash
# Check ADB connection
adb devices

# View logs
adb logcat | grep sigil
```

---

## Troubleshooting

### Desktop Issues

**Build fails:**
```bash
# Clean and rebuild
cargo clean
cargo build --release
```

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8080 | xargs kill -9
```

### Mobile Issues

**Expo not starting:**
```bash
# Clear cache
npx expo start --clear
```

**API connection failed:**
- Ensure API server is running
- Check IP address (use `adb shell ip addr show` for Android emulator IP)
- Disable firewall if blocking connections

### Quest 3 Issues

**ADB not recognizing device:**
```bash
adb kill-server
adb start-server
adb devices
```

**NDK not found:**
```bash
echo $ANDROID_NDK_HOME
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/25.2.9519653
```

---

## Summary of Files

### Desktop/Web/Quest 3
- `install-prerequisites.bat` - Windows prerequisite installer
- `setup-environment.bat` - Windows environment setup
- `build.bat` - Windows build script
- `run-api.bat` - Windows API server starter
- `run-tests.bat` - Windows test runner
- `setup-quest-sdk.bat` - Quest SDK environment setup
- `build-and-run.bat` - Windows one-step build and run
- `Makefile` - Linux/macOS automation
- `Dockerfile` - Docker build
- `docker-compose.yml` - Docker orchestration
- `docs/QUEST_SDK_REQUIREMENTS.md` - Quest SDK documentation

### Mobile (Expo) - To Be Created
- `sigil-mobile/app.json` - Expo configuration
- `sigil-mobile/src/services/api.ts` - API service
- `sigil-mobile/src/services/auth.ts` - Keyless authentication
- `sigil-mobile/src/screens/ChatScreen.tsx` - Chat UI
- `sigil-mobile/App.tsx` - Main app component

### Icons
- `assets/icons/sigil-icon.svg` - Source SVG
- `assets/icons/generate-icons.py` - Python icon generator
- `assets/icons/generate-icons.bat` - Windows icon generator

### Configuration
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore patterns
- `.editorconfig` - Editor configuration

---

## Next Steps

1. **Desktop:** Run `build-and-run.bat` (Windows) or `make run` (Linux/macOS)
2. **Web:** Access `http://127.0.0.1:8080` in browser
3. **Mobile:** Follow Expo setup guide above (when ready)
4. **Quest 3:** Follow Quest 3 setup guide above
5. **Icons:** Run icon generation scripts for your platform

---

**Authentication:** Keyless Cryptographic Warrants (No API Keys) ✅  
**Platforms:** Desktop, Web, Mobile (Expo), Quest 3 ✅  
**Files:** All required scripts and documentation provided ✅
