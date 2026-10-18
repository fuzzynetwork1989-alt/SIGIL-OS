# NEXORA Omega Desktop Client

Tauri with Rust production desktop application for NEXORA Omega.

## Features

- Windows, macOS, and Linux installers
- Secure OS credential storage
- Device registration and revocation
- Deep links and protocol handlers
- Native notifications
- Window/session restoration
- File selection and upload via permissioned broker
- Clipboard and drag/drop with classification and scanning
- Auto-update with signed artifacts and staged rollout
- Crash reporting with PII-safe diagnostics
- Offline read-only cache only where authorized
- Accessibility and keyboard-first workflows
- Code signing, notarization where applicable

## Tech Stack

- **Framework**: Tauri with Rust backend
- **UI**: TypeScript/React (shared with web console)
- **Styling**: Tailwind CSS with design system tokens
- **Build**: Tauri CLI

## Local Development

```bash
pnpm install
pnpm tauri dev
```

## Production Build

```bash
pnpm tauri build
```

## Security

- No direct database access
- All operations through cloud API
- Secure credential storage
- Code signing for all releases
- Notarization for macOS

## Requirements

Desktop client is a secure cloud client, not a shadow local control plane. All cognitive state remains in the cloud.