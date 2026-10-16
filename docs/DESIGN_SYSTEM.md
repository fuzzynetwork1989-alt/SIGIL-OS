# SIGIL OS - Design System

**Version:** 1.0
**Date:** 2026-10-16
**Status:** Complete

---

## Overview

SIGIL OS uses a cohesive design system across all experience surfaces: web, desktop, mobile, and Quest 3. The design system ensures consistency, accessibility, and a unified user experience.

---

## Design Principles

1. **Simplicity First** - Everyday users ages 10+ should be able to use SIGIL without technical knowledge
2. **Governance Transparency** - Users should always understand what's happening with their data and AI operations
3. **Accessibility First** - WCAG 2.1 AA compliance across all interfaces
4. **Responsive Design** - Seamless experience across all devices and form factors
5. **Embodied Presence** - Quest 3 experience should feel natural and spatial

---

## Color System

### Primary Colors

```css
--primary-dark: #1a1a2e;
--primary-medium: #16213e;
--primary-light: #0f3460;
--accent: #e94560;
--accent-hover: #ff6b6b;
```

### Semantic Colors

```css
--success: #2ecc71;
--warning: #f39c12;
--error: #e74c3c;
--info: #3498db;
```

### Neutral Colors

```css
--text-primary: #ffffff;
--text-secondary: #b0b0b0;
--text-muted: #6b6b6b;
--background-dark: #0d0d0d;
--background-medium: #1a1a1a;
--background-light: #2a2a2a;
```

---

## Typography

### Font Families

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--font-display: 'Playfair Display', serif;
```

### Type Scale

```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing System

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

---

## Component Library

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--accent);
  color: var(--text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: var(--font-semibold);
  min-height: 44px; /* Touch-friendly */
  transition: all 0.2s ease;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--accent);
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: var(--font-semibold);
  min-height: 44px;
}
```

### Input Fields

```css
.input-field {
  background: var(--background-medium);
  color: var(--text-primary);
  border: 1px solid var(--background-light);
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  font-size: var(--text-base);
  min-height: 44px;
}
```

### Cards

```css
.card {
  background: var(--background-medium);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
```

### Modals

```css
.modal {
  background: var(--background-dark);
  border-radius: 16px;
  padding: var(--space-8);
  max-width: 600px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.5);
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Focus States:**
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**Screen Reader Support:**
- All interactive elements have ARIA labels
- Live regions for dynamic content
- Proper heading hierarchy (h1-h6)

**Keyboard Navigation:**
- All functionality accessible via keyboard
- Tab order follows logical flow
- Escape key closes modals

**Touch Targets:**
- Minimum 44x44 pixels for touch targets
- Adequate spacing between interactive elements

---

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## Animation

**Duration:**
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

**Easing:**
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Quest 3 Specific

### Spatial UI

**Distance:**
- Comfortable viewing distance: 1.5-2 meters
- Near-field interactions: 0.5-1 meter

**Text Sizes (in virtual space):**
- Body text: 24-32 units
- Headings: 48-64 units
- Button text: 32-40 units

**Spatial Layout:**
- 120° field of view for main content
- Peripheral content at 30-60°
- Hand interaction zone: 0.3-0.7 meters

---

## Implementation

The design system is implemented in:
- `web/themes.css` - Web UI theme
- `ui-ux/` - Shared component library
- `experience-surfaces/` - Platform-specific implementations

---

**Document Status:** Complete
**Last Updated:** 2026-10-16
