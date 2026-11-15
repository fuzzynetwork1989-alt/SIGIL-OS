# NEXORA Omega Design System

Tokens, accessible components, themes, and icon packs for NEXORA Omega.

## Components

- **Tokens** - Design tokens (colors, typography, spacing, radius, elevation, motion)
- **Components** - Accessible React components
- **Themes** - Theme packs (light, dark, high-contrast, system-follow)
- **Icons** - Icon packs with semantic naming
- **Patterns** - Reusable interaction patterns

## Theme Packs

A theme pack includes:
- Versioned color tokens
- Typography tokens
- Spacing and radius tokens
- Elevation and motion tokens
- Light, dark, high-contrast, and system-follow modes
- WCAG contrast validation results
- Platform-specific token exports for web, desktop, Android, and iOS
- Signed package manifest and rollback version

## Icon Packs

An icon pack includes:
- Versioned icon set
- Semantic icon names, not file-path references
- Web SVG assets with sanitization
- Native Android and iOS exports
- Platform size variants
- Accessibility labels
- Theme-aware color support
- License manifest
- Integrity hash and signed release record

## Usage

```bash
pnpm install @nexora/design-system
```

## Requirements

- WCAG AA/AAA contrast compliance
- Keyboard navigation support
- Screen reader support
- Platform-specific behaviors
- Theme consistency across all clients