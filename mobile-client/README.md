# NEXORA Omega Mobile Client

Expo/React Native Android and iOS application for NEXORA Omega.

## Features

- Android and iOS release builds
- Secure storage for session/device keys
- Passkey and OAuth authentication
- Push notifications for approvals, process completion, incidents, and mentions
- Deep links and universal/app links
- Responsive navigation and mobile-specific command patterns
- Biometric re-authentication for sensitive operations
- File, camera, photo library, microphone, and notification permissions
- Background task constraints respecting iOS/Android policies
- Upload management, resumable upload where needed
- Crash reporting, performance telemetry, privacy-safe analytics
- Store listing metadata, screenshots, privacy disclosures
- EAS-managed signing, TestFlight, Play internal testing, staged rollout

## Tech Stack

- **Framework**: Expo/React Native
- **Build**: EAS Build and EAS Submit
- **UI**: React Native with design system components
- **Navigation**: React Navigation
- **State**: React Context + API state

## Local Development

```bash
pnpm install
pnpm expo start
```

## Production Build

```bash
eas build --platform all
```

## Store Submission

```bash
eas submit --platform all
```

## Requirements

- Store screenshots based on real shipped functionality
- Privacy policy, terms, data-processing disclosures
- App privacy manifests and platform permission explanations
- Content moderation and abuse-reporting paths
- Accessibility validation
- Production error handling and customer support tooling
- Remote kill switch and feature flag controls