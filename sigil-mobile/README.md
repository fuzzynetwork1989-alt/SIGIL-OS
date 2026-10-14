# SIGIL OS Mobile App

Expo/React Native mobile application for SIGIL OS.

## Features

- Onboarding flow with pricing plans
- Chat interface with keyless authentication
- Avatar customization
- Settings panel
- Ed25519 cryptographic signing
- Secure storage integration

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

```bash
cd sigil-mobile
npm install
```

### Running

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run in web browser
npm run web
```

## Architecture

### Screens

- `OnboardingScreen` - First-time user onboarding
- `ChatScreen` - Main chat interface
- `AvatarScreen` - Avatar customization
- `SettingsScreen` - Settings and preferences

### Services

- `AuthService` - Keyless authentication with Ed25519
- `ApiService` - API communication with signed requests

## Keyless Authentication

The mobile app uses Ed25519 cryptographic signing for keyless authentication:

1. Key pair generation on device
2. Private key stored in secure storage (Keychain/Keystore)
3. Every request signed with device key
4. Server verifies signatures
5. No API keys or static secrets

## API Integration

The mobile app communicates with the SIGIL OS API server at `http://127.0.0.1:8080/api/v1`.

### Endpoints

- `POST /chat` - Send chat message
- `GET /dream-weaving` - Get dream weaving data
- `GET /sigils` - Get sigil explorer data
- `PUT /avatar` - Update avatar settings

## Security

- Private keys stored in `expo-secure-store`
- All requests cryptographically signed
- Device-attested identity
- No secrets in source code

## Building for Production

### Android

```bash
expo build:android
```

### iOS

```bash
expo build:ios
```

## Dependencies

- expo ~50.0.0
- expo-secure-store ~12.8.1
- expo-crypto ~12.8.1
- react 18.2.0
- react-native 0.73.6
- @react-navigation/native ^6.1.9
- axios ^1.6.2

## Notes

- The current implementation uses mock Ed25519 signing
- In production, integrate a proper Ed25519 library
- WebAuthn/Passkey support requires additional configuration
- API server must be running for full functionality
