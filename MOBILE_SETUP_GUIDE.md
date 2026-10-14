# SIGIL OS Mobile Setup Guide

Complete guide for setting up and running the SIGIL OS mobile application (Expo/React Native).

## Prerequisites

### Required Software

1. **Node.js** (18.0 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

3. **Git**
   - Download: https://git-scm.com/

### Platform-Specific Requirements

#### Android Development

1. **Android Studio**
   - Download: https://developer.android.com/studio
   - Install Android SDK (API 32+)
   - Install Android SDK Build-Tools
   - Set up Android Emulator or connect physical device

2. **Environment Variables**
   ```bash
   ANDROID_HOME=/path/to/Android/Sdk
   PATH=$PATH:$ANDROID_HOME/emulator
   PATH=$PATH:$ANDROID_HOME/tools
   PATH=$PATH:$ANDROID_HOME/tools/bin
   PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### iOS Development (macOS only)

1. **Xcode**
   - Download from Mac App Store
   - Install Xcode Command Line Tools
   ```bash
   xcode-select --install
   ```

2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

## Installation

### 1. Navigate to Mobile Directory

```bash
cd sigil-mobile
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Expo SDK
- React Native
- Navigation libraries
- Secure storage
- Crypto utilities
- HTTP client

### 3. Start Development Server

```bash
npm start
```

This will start the Expo development server and display a QR code.

## Running the App

### Option 1: Expo Go App (Recommended for Testing)

1. Install **Expo Go** on your mobile device:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Scan the QR code displayed in the terminal with Expo Go

3. The app will load on your device

### Option 2: Android Emulator

```bash
npm run android
```

This will:
- Build the Android APK
- Install on emulator
- Launch the app

### Option 3: iOS Simulator (macOS only)

```bash
npm run ios
```

This will:
- Build the iOS app
- Launch in iOS Simulator
- Run the app

### Option 4: Web Browser

```bash
npm run web
```

This will open the app in your default web browser.

## App Features

### Onboarding Flow

1. **Welcome Slide** - Introduction to SIGIL OS
2. **Features Slide** - Cryptographic warrants explanation
3. **Get Started Slide** - Plan selection
4. **Sign Up/Login** - Passkey authentication

### Main Screens

1. **Chat** - AI conversation interface
2. **Avatar** - Avatar customization (style, skin tone, eye color, expression)
3. **Settings** - Preferences and account management

### Keyless Authentication

The mobile app uses Ed25519 cryptographic signing:

- No API keys
- Device-bound identity
- Private keys in secure storage (Keychain/Keystore)
- Every request signed
- Server verifies signatures

## API Integration

The mobile app connects to the SIGIL OS API server.

### Start the API Server

```bash
# From project root
cd ..
run-api.bat  # Windows
# or
make run     # Linux/macOS
```

### API Configuration

The API is configured in `src/services/api.ts`:

```typescript
private static readonly API_BASE_URL = 'http://127.0.0.1:8080/api/v1';
```

For production, update this to your production API URL.

## Authentication Flow

### 1. First-Time User

1. User completes onboarding
2. Selects plan (Free, Pro, Enterprise)
3. Registers with Passkey (WebAuthn)
4. Ed25519 key pair generated
5. Private key stored in secure storage
6. Public key sent to server

### 2. Returning User

1. User signs in with Passkey
2. Private key retrieved from secure storage
3. Request signed with private key
4. Server verifies signature
5. Access granted

## Building for Production

### Android APK

```bash
expo build:android
```

This will:
- Build production APK
- Upload to Expo servers
- Provide download link

### iOS IPA (macOS only)

```bash
expo build:ios
```

This will:
- Build production IPA
- Upload to Expo servers
- Provide download link

### EAS Build (Recommended)

Expo Application Services (EAS) provides faster builds:

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Troubleshooting

### Common Issues

**Issue: "Cannot find module 'expo-secure-store'"**
```bash
npm install expo-secure-store
```

**Issue: "Android SDK not found"**
- Install Android Studio
- Set ANDROID_HOME environment variable
- Restart terminal

**Issue: "Xcode not found" (macOS)**
- Install Xcode from Mac App Store
- Run: `xcode-select --install`

**Issue: "Metro bundler not running"**
```bash
npm start -- --clear
```

**Issue: "API connection failed"**
- Ensure API server is running: `run-api.bat` or `make run`
- Check API URL in `src/services/api.ts`
- Verify network connectivity

### Debug Mode

Enable debug mode in the app by shaking the device or pressing `Ctrl+M` (Android) / `Cmd+D` (iOS) in the emulator.

## Development Tips

### Hot Reloading

The app supports hot reloading. Changes to code will automatically reload.

### Debugging

Use React Native Debugger for advanced debugging:
```bash
npm install -g react-native-debugger
```

### Testing

Run tests (when implemented):
```bash
npm test
```

## Security Considerations

### Secure Storage

- Private keys stored in `expo-secure-store`
- Keys are never exposed to JavaScript
- Keys are bound to the device

### Certificate Pinning

In production, implement certificate pinning to prevent MITM attacks.

### API Communication

- All requests are signed
- Server validates signatures
- Invalid signatures are rejected

## Next Steps

1. Complete the onboarding flow
2. Test the chat interface
3. Customize your avatar
4. Configure settings
5. Explore keyless authentication

## Support

For issues or questions:
- Check the main README.md
- Review COMPLETE_SETUP_GUIDE.md
- Visit the project repository

## File Structure

```
sigil-mobile/
├── App.tsx              # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── README.md            # This file
├── .gitignore          # Git ignore rules
└── src/
    ├── screens/
    │   ├── OnboardingScreen.tsx
    │   ├── ChatScreen.tsx
    │   ├── AvatarScreen.tsx
    │   └── SettingsScreen.tsx
    └── services/
        ├── auth.ts      # Authentication service
        └── api.ts       # API service
```

## Summary

The SIGIL OS mobile app provides:
- ✅ Complete onboarding flow
- ✅ Keyless authentication (Ed25519)
- ✅ Chat interface
- ✅ Avatar customization
- ✅ Settings management
- ✅ Secure storage integration
- ✅ API communication

Ready to use with the SIGIL OS backend!
