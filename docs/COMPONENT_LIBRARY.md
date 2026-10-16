# SIGIL OS - Component Library

**Version:** 1.0
**Date:** 2026-10-16
**Status:** Complete

---

## Overview

The SIGIL OS component library provides reusable UI components across all platforms: web, desktop, mobile, and Quest 3.

---

## Web Components

### Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
```

### Input Component

```typescript
interface InputProps {
  type: 'text' | 'password' | 'email';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}
```

### Card Component

```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated';
}
```

### Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### ChatMessage Component

```typescript
interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  avatar?: string;
  sources?: Source[];
}
```

---

## Desktop Components

### Window Component

```rust
pub struct Window {
    pub title: String,
    pub width: u32,
    pub height: u32,
    pub resizable: bool,
    pub decorated: bool,
}
```

### SystemTray Component

```rust
pub struct SystemTray {
    pub icon: String,
    pub tooltip: String,
    pub menu_items: Vec<MenuItem>,
}
```

### Menu Component

```rust
pub struct MenuItem {
    pub label: String,
    pub shortcut: Option<String>,
    pub action: Box<dyn Fn()>,
    pub separator: bool,
}
```

---

## Mobile Components

### TabBar Component

```typescript
interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

### FloatingActionButton Component

```typescript
interface FABProps {
  icon: string;
  onPress: () => void;
  position: 'bottom-right' | 'bottom-center';
}
```

### Swipeable Component

```typescript
interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}
```

---

## Quest 3 Components

### SpatialPanel Component

```csharp
public class SpatialPanel {
    public Vector3 Position { get; set; }
    public Vector3 Rotation { get; set; }
    public Vector2 Size { get; set; }
    public GameObject Content { get; set; }
}
```

### AvatarComponent

```csharp
public class AvatarComponent {
    public Transform Transform { get; set; }
    public FacialExpression Expression { get; set; }
    public LipSyncController LipSync { get; set; }
}
```

### SpatialButton Component

```csharp
public class SpatialButton {
    public Collider Hitbox { get; set; }
    public Material HoverMaterial { get; set; }
    public Material PressedMaterial { get; set; }
}
```

---

## Implementation

**Web:** React components in `ui-ux/`
**Desktop:** Slint components in `ui-ux/desktop/`
**Mobile:** React Native components in `sigil-mobile/`
**Quest 3:** Unity components in `quest-integration/`

---

**Document Status:** Complete
**Last Updated:** 2026-10-16
