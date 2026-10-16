# SIGIL OS - Accessibility Guidelines

**Version:** 1.0
**Date:** 2026-10-16
**Status:** Complete

---

## Overview

SIGIL OS is committed to WCAG 2.1 AA compliance across all experience surfaces, ensuring accessibility for users with disabilities.

---

## WCAG 2.1 AA Compliance

### Perceivable

**Text Alternatives:**
- All images have alt text
- Icons have text labels
- Charts have data tables

**Time-Based Media:**
- Captions for video content
- Audio descriptions for visual content
- No auto-playing media

**Adaptable:**
- Content can be presented in different ways
- Responsive design works with screen magnifiers
- Content reflow without loss of information

**Distinguishable:**
- Color is not the only visual means of conveying information
- Text spacing is at least 1.5 times font size
- Focus indicators are visible

### Operable

**Keyboard Accessible:**
- All functionality available via keyboard
- No keyboard traps
- Logical tab order
- Focus visible

**Time Sufficient:**
- Users can disable time limits
- Moving content can be paused
- No flashing content (3 flashes/second)

**Seizures and Physical Reactions:**
- No content that flashes more than 3 times/second
- No content known to cause seizures

**Navigable:**
- Multiple ways to navigate
- Page titles are descriptive
- Focus order is logical
- Link purpose is clear

### Understandable

**Readable:**
- Language is specified
- Text can be read and understood
- Pronunciation is available

**Predictable:**
- Navigation is consistent
- Input assistance is provided
- Error prevention is available

**Input Assistance:**
- Error identification
- Labels and instructions
- Error suggestions

### Robust

**Compatible:**
- Markup is valid
- Name, role, value can be programmatically determined
- Status messages can be programmatically determined

---

## Platform-Specific Guidelines

### Web Accessibility

**HTML Semantics:**
- Proper heading hierarchy (h1-h6)
- Use landmark regions (main, nav, header, footer)
- Semantic HTML elements

**ARIA Attributes:**
- `aria-label` for unlabeled controls
- `aria-live` for dynamic content
- `aria-expanded` for collapsible elements
- `aria-hidden` for decorative content

**Keyboard Navigation:**
- Tab order follows visual order
- Focus management in modals
- Escape key closes overlays
- Skip links for main content

**Screen Reader Support:**
- Test with NVDA, JAWS, VoiceOver
- Provide context for dynamic content
- Announce state changes
- Proper form labeling

### Desktop Accessibility

**System Integration:**
- Respect system accessibility settings
- Support high contrast mode
- Support screen readers
- Support keyboard navigation

**Text Scaling:**
- Support system font size
- UI adapts to scaling
- No truncation at 200% scale

### Mobile Accessibility

**Touch Targets:**
- Minimum 44x44 pixels
- 8px spacing between targets
- Gesture alternatives (buttons)

**Voice Control:**
- Voice commands for key actions
- Voice feedback for state changes
- Support for screen readers (TalkBack, VoiceOver)

### Quest 3 Accessibility

**Visual Accessibility:**
- Text scaling in VR
- High contrast mode
- Color blind friendly palettes

**Motor Accessibility:**
- Hand tracking alternatives
- Voice commands
- Gaze interaction
- Controller remapping

---

## Testing Checklist

### Automated Testing

- Axe DevTools scan
- Lighthouse accessibility audit
- WAVE browser extension
- Pa11y automated testing

### Manual Testing

- Keyboard-only navigation
- Screen reader testing
- High contrast mode
- Text scaling (200%)
- Reduced motion

### User Testing

- Test with assistive technology users
- Test with motor-impaired users
- Test with color-blind users
- Test with low-vision users

---

## Documentation Accessibility

**Code Examples:**
- Syntax highlighting
- Copy button for code
- Keyboard shortcuts documented

**Images:**
- Alt text for all images
- Descriptive captions
- Diagrams have text alternatives

---

## Accessibility Statement

SIGIL OS is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

If you experience difficulty accessing our software, please contact accessibility@sigil.os

---

**Document Status:** Complete
**Last Updated:** 2026-10-16
**WCAG Level:** AA
