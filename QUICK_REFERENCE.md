# SIGIL OS - Quick Reference File List

**Authentication:** Keyless Cryptographic Warrants (No API Keys)  
**Last Updated:** 2026-10-07

---

## Desktop Setup - Exact Files

### Windows
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\install-prerequisites.bat
C:\Users\Corey Smith\Devin Projects\SIGIL OS\setup-environment.bat
C:\Users\Corey Smith\Devin Projects\SIGIL OS\build.bat
C:\Users\Corey Smith\Devin Projects\SIGIL OS\run-api.bat
C:\Users\Corey Smith\Devin Projects\SIGIL OS\build-and-run.bat
```

**Run in order:**
1. Right-click `install-prerequisites.bat` → Run as Administrator
2. Run `setup-environment.bat`
3. Run `build-and-run.bat` (or `build.bat` then `run-api.bat`)

### Linux/macOS
```
/Users/yourname/SIGIL-OS/Makefile
```

**Run:**
```bash
make install-deps  # Install dependencies
make setup-env     # Setup directories
make run           # Build and run
```

### Docker (All Platforms)
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\Dockerfile
C:\Users\Corey Smith\Devin Projects\SIGIL OS\docker-compose.yml
```

**Run:**
```bash
docker-compose up -d
```

---

## Web UI Setup - Exact Files

### Files Needed
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\run-api.bat (Windows)
# OR
C:\Users\Corey Smith\Devin Projects\SIGIL OS\Makefile (Linux/macOS)
# OR
C:\Users\Corey Smith\Devin Projects\SIGIL OS\docker-compose.yml (Docker)
```

**Steps:**
1. Start API server (see Desktop Setup above)
2. Open browser: `http://127.0.0.1:8080`

**Icons for Web UI:**
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\sigil-icon-192x192.png
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\sigil-icon-512x512.png
```

**Generate icons:**
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\generate-icons.bat (Windows)
# OR
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\generate-icons.py (Python)
```

---

## Mobile Setup (Expo/React Native) - Files to Create

**Status:** NOT YET IMPLEMENTED - Planned for v1.1 (Q4 2026)

### Files You Need to Create (When Ready)

#### Project Structure
```
sigil-mobile/
├── app.json
├── package.json
├── App.tsx
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    ├── screens/
    │   └── ChatScreen.tsx
    └── services/
        ├── api.ts
        └── auth.ts
```

#### File Contents

**app.json:**
```json
{
  "expo": {
    "name": "SIGIL OS",
    "slug": "sigil-os",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "ios": {
      "bundleIdentifier": "com.sigilos.app"
    },
    "android": {
      "package": "com.sigilos.app"
    }
  }
}
```

**src/services/api.ts:**
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
```

**src/services/auth.ts:**
```typescript
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const KEY_PAIR_KEY = 'sigil_key_pair';

export const generateKeyPair = async () => {
  const privateKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Date.now().toString() + Math.random().toString()
  );
  
  const publicKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    privateKey + 'public'
  );

  const keyPair = { publicKey, privateKey };
  await SecureStore.setItemAsync(KEY_PAIR_KEY, JSON.stringify(keyPair));
  return keyPair;
};

export const signRequest = async (data: string) => {
  const keyPair = await generateKeyPair();
  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + keyPair.privateKey
  );
  return signature;
};
```

**src/screens/ChatScreen.tsx:**
```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { sendChatMessage } from '../services/api';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    const result = await sendChatMessage(message);
    setResponse(result.response);
  };

  return (
    <View style={styles.container}>
      <Text>{response}</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 12, marginBottom: 8 },
});
```

**App.tsx:**
```typescript
import React from 'react';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return <ChatScreen />;
}
```

### Setup Commands

```bash
# Create Expo project
npx create-expo-app sigil-mobile
cd sigil-mobile

# Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios
npm install expo-secure-store
npm install @simplewebauthn/browser
npm install expo-crypto

# Copy icons from SIGIL OS project
cp ../SIGIL-OS/assets/icons/sigil-icon-192x192.png assets/icon.png
cp ../SIGIL-OS/assets/icons/sigil-icon-512x512.png assets/adaptive-icon.png

# Run development
npx expo start

# Build for production
eas build --platform android
eas build --platform ios
```

---

## Quest 3 Setup - Exact Files

### Documentation
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\docs\QUEST_SDK_REQUIREMENTS.md
```

### Setup Script
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\setup-quest-sdk.bat
```

### Manual Installation Required

1. **Android Studio**
   - Download: https://developer.android.com/studio
   - Install with default settings

2. **Android SDK/NDK**
   - Open Android Studio
   - Tools → SDK Manager
   - Install: Platform-Tools, Build-Tools, NDK (Side by side)

3. **Quest SDK**
   - Download: https://developer.oculus.com/downloads/package/occulus-mobile-sdk/
   - Extract to: `C:\OculusMobileSDK`

4. **OpenXR**
   - Download: https://github.com/KhronosGroup/OpenXR-SDK/releases
   - Extract to: `C:\Program Files\OpenXR`

### Run in Order
1. Install Android Studio
2. Install SDK/NDK via Android Studio
3. Download and extract Quest SDK
4. Download and extract OpenXR
5. Run `setup-quest-sdk.bat`
6. Enable Developer Mode on Quest 3 (via Meta Quest app)
7. Connect Quest 3 via USB-C
8. Run: `adb devices` to verify
9. Run: `rustup target add aarch64-linux-android`
10. Run: `cargo install cargo-apk`
11. Build: `cd quest-integration && cargo apk build`
12. Deploy: `cargo apk install`

---

## Icons - Exact Files

### Source Files
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\sigil-icon.svg
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\simple-icon.svg
```

### Generation Scripts
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\generate-icons.bat (Windows)
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\generate-icons.py (Python)
```

### Documentation
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\assets\icons\README.md
```

### Generate Icons

**Windows:**
```batch
cd assets\icons
generate-icons.bat
```

**Python:**
```bash
cd assets/icons
pip install cairosvg pillow
python generate-icons.py
```

**Generated Files (in project root):**
```
sigil-icon.ico
sigil-icon-16x16.png
sigil-icon-32x32.png
sigil-icon-48x48.png
sigil-icon-64x64.png
sigil-icon-128x128.png
sigil-icon-192x192.png
sigil-icon-256x256.png
sigil-icon-512x512.png
```

---

## Configuration - Exact Files

### Environment Template
```
C:\Users\Corey Smith\Devin Projects\SIGIL OS\.env.example
```

### Auto-Generated Config
```
%APPDATA%\SIGIL-OS\config.yaml (Windows)
~/.config/sigil-os/config.yaml (Linux)
~/Library/Application Support/SIGIL-OS/config.yaml (macOS)
```

**Auto-generated by:** `run-api.bat` and `build-and-run.bat`

---

## All Platform Summary

### Desktop (Windows) - 3 Commands
```batch
install-prerequisites.bat
setup-environment.bat
build-and-run.bat
```

### Desktop (Linux/macOS) - 3 Commands
```bash
make install-deps
make setup-env
make run
```

### Desktop (Docker) - 1 Command
```bash
docker-compose up -d
```

### Web UI - 1 Step
1. Start API server (see Desktop above)
2. Open browser: `http://127.0.0.1:8080`

### Mobile (Expo) - NOT READY
- Planned for v1.1 (Q4 2026)
- See COMPLETE_SETUP_GUIDE.md for implementation details

### Quest 3 - 12 Steps
1. Install Android Studio
2. Install SDK/NDK
3. Download Quest SDK
4. Download OpenXR
5. Run `setup-quest-sdk.bat`
6. Enable Developer Mode on Quest 3
7. Connect Quest 3
8. Verify with `adb devices`
9. Add Rust Android target
10. Install cargo-apk
11. Build with `cargo apk build`
12. Deploy with `cargo apk install`

---

## Authentication - Keyless System

**No API keys used.** SIGIL OS uses:

1. **Ed25519 Cryptographic Signatures** - Every action signed
2. **Device-Attested Identity** - Hardware-backed identity
3. **Capability Leases** - Temporary authorizations
4. **Sigil Ledger** - All actions recorded and reversible

**Files:**
```
sigil-core/sigil/src/signing.rs - Ed25519 signing implementation
```

---

## Verification Commands

### Desktop/Web
```bash
curl http://127.0.0.1:8080/health
```

### Mobile (Expo)
```bash
npx expo start
```

### Quest 3
```bash
adb devices
adb logcat | grep sigil
```

---

## Missing Components

### Not Yet Implemented
- ❌ Mobile app (iOS/Android) - Planned v1.1
- ❌ Web UI implementation - In progress
- ❌ Full Candle ML integration - Placeholder currently
- ❌ Actual model download - Manual currently

### Ready to Use
- ✅ Desktop API server
- ✅ Desktop build scripts
- ✅ Docker support
- ✅ Quest 3 integration structure
- ✅ Icon generation
- ✅ Keyless authentication foundation
- ✅ Candle v0.11.0 (built successfully)

---

## File Locations Summary

### Root Directory (SIGIL OS/)
```
install-prerequisites.bat          # Windows - Install Rust, Git, VS
setup-environment.bat              # Windows - Create directories
build.bat                         # Windows - Build project
run-api.bat                       # Windows - Start API server
run-tests.bat                     # Windows - Run tests
setup-quest-sdk.bat               # Windows - Quest SDK setup
build-and-run.bat                 # Windows - One-step build+run
Makefile                          # Linux/macOS - Build automation
Dockerfile                        # All - Docker build
docker-compose.yml                # All - Docker orchestration
.env.example                      # All - Environment template
.gitignore                        # All - Git ignore patterns
.editorconfig                     # All - Editor configuration
```

### Documentation (docs/)
```
docs/QUEST_SDK_REQUIREMENTS.md    # Quest SDK detailed guide
```

### Icons (assets/icons/)
```
assets/icons/sigil-icon.svg       # Source SVG (512x512)
assets/icons/simple-icon.svg      # Source SVG (64x64)
assets/icons/generate-icons.bat   # Windows icon generator
assets/icons/generate-icons.py    # Python icon generator
assets/icons/README.md            # Icon documentation
```

### Guides (Root)
```
FIRST_TIME_INSTALLATION_GUIDE.md  # Comprehensive guide (888 lines)
COMPLETE_SETUP_GUIDE.md           # Step-by-step for all platforms (1002 lines)
INSTALLATION_SUMMARY.md           # Summary of changes
QUICK_REFERENCE.md                # This file
```

---

**All files listed above exist in the project.**  
**Mobile (Expo) files need to be created when implementing mobile app.**
