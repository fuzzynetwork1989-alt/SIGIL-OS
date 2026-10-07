//! Theme engine for SIGIL OS
//!
//! This module provides theme management with light/dark modes and custom themes.

use std::collections::HashMap;
use uuid::Uuid;

use crate::UiUxError;

/// Color scheme
#[derive(Debug, Clone)]
pub struct ColorScheme {
    /// Primary color
    pub primary: String,

    /// Secondary color
    pub secondary: String,

    /// Background color
    pub background: String,

    /// Surface color
    pub surface: String,

    /// Text color
    pub text: String,

    /// Accent color
    pub accent: String,
}

/// Typography settings
#[derive(Debug, Clone)]
pub struct Typography {
    /// Font family
    pub font_family: String,

    /// Font size base
    pub font_size_base: u32,

    /// Font size large
    pub font_size_large: u32,

    /// Font size small
    pub font_size_small: u32,
}

/// Spacing settings
#[derive(Debug, Clone)]
pub struct Spacing {
    /// Small spacing
    pub small: u32,

    /// Medium spacing
    pub medium: u32,

    /// Large spacing
    pub large: u32,
}

/// Theme
#[derive(Debug, Clone)]
pub struct Theme {
    /// Theme ID
    pub id: Uuid,

    /// Theme name
    pub name: String,

    /// Theme mode (light, dark, custom)
    pub mode: ThemeMode,

    /// Color scheme
    pub colors: ColorScheme,

    /// Typography
    pub typography: Typography,

    /// Spacing
    pub spacing: Spacing,

    /// Theme metadata
    pub metadata: HashMap<String, String>,
}

/// Theme mode
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ThemeMode {
    Light,
    Dark,
    Custom,
}

/// Theme preset
#[derive(Debug, Clone)]
pub enum ThemePreset {
    Light,
    Dark,
    Blue,
    Green,
    Purple,
}

impl ThemePreset {
    /// Create a theme from a preset
    pub fn to_theme(&self) -> Theme {
        match self {
            ThemePreset::Light => ThemePreset::light_theme(),
            ThemePreset::Dark => ThemePreset::dark_theme(),
            ThemePreset::Blue => ThemePreset::blue_theme(),
            ThemePreset::Green => ThemePreset::green_theme(),
            ThemePreset::Purple => ThemePreset::purple_theme(),
        }
    }

    fn light_theme() -> Theme {
        Theme {
            id: Uuid::new_v4(),
            name: "Light".to_string(),
            mode: ThemeMode::Light,
            colors: ColorScheme {
                primary: "#007AFF".to_string(),
                secondary: "#5856D6".to_string(),
                background: "#FFFFFF".to_string(),
                surface: "#F2F2F7".to_string(),
                text: "#000000".to_string(),
                accent: "#FF3B30".to_string(),
            },
            typography: Typography {
                font_family: "San Francisco".to_string(),
                font_size_base: 16,
                font_size_large: 20,
                font_size_small: 14,
            },
            spacing: Spacing {
                small: 8,
                medium: 16,
                large: 24,
            },
            metadata: HashMap::new(),
        }
    }

    fn dark_theme() -> Theme {
        Theme {
            id: Uuid::new_v4(),
            name: "Dark".to_string(),
            mode: ThemeMode::Dark,
            colors: ColorScheme {
                primary: "#0A84FF".to_string(),
                secondary: "#5E5CE6".to_string(),
                background: "#000000".to_string(),
                surface: "#1C1C1E".to_string(),
                text: "#FFFFFF".to_string(),
                accent: "#FF453A".to_string(),
            },
            typography: Typography {
                font_family: "San Francisco".to_string(),
                font_size_base: 16,
                font_size_large: 20,
                font_size_small: 14,
            },
            spacing: Spacing {
                small: 8,
                medium: 16,
                large: 24,
            },
            metadata: HashMap::new(),
        }
    }

    fn blue_theme() -> Theme {
        Theme {
            id: Uuid::new_v4(),
            name: "Blue".to_string(),
            mode: ThemeMode::Custom,
            colors: ColorScheme {
                primary: "#2196F3".to_string(),
                secondary: "#1976D2".to_string(),
                background: "#E3F2FD".to_string(),
                surface: "#BBDEFB".to_string(),
                text: "#0D47A1".to_string(),
                accent: "#FF5722".to_string(),
            },
            typography: Typography {
                font_family: "Roboto".to_string(),
                font_size_base: 16,
                font_size_large: 20,
                font_size_small: 14,
            },
            spacing: Spacing {
                small: 8,
                medium: 16,
                large: 24,
            },
            metadata: HashMap::new(),
        }
    }

    fn green_theme() -> Theme {
        Theme {
            id: Uuid::new_v4(),
            name: "Green".to_string(),
            mode: ThemeMode::Custom,
            colors: ColorScheme {
                primary: "#4CAF50".to_string(),
                secondary: "#388E3C".to_string(),
                background: "#E8F5E9".to_string(),
                surface: "#C8E6C9".to_string(),
                text: "#1B5E20".to_string(),
                accent: "#FF9800".to_string(),
            },
            typography: Typography {
                font_family: "Roboto".to_string(),
                font_size_base: 16,
                font_size_large: 20,
                font_size_small: 14,
            },
            spacing: Spacing {
                small: 8,
                medium: 16,
                large: 24,
            },
            metadata: HashMap::new(),
        }
    }

    fn purple_theme() -> Theme {
        Theme {
            id: Uuid::new_v4(),
            name: "Purple".to_string(),
            mode: ThemeMode::Custom,
            colors: ColorScheme {
                primary: "#9C27B0".to_string(),
                secondary: "#7B1FA2".to_string(),
                background: "#F3E5F5".to_string(),
                surface: "#E1BEE7".to_string(),
                text: "#4A148C".to_string(),
                accent: "#FFC107".to_string(),
            },
            typography: Typography {
                font_family: "Roboto".to_string(),
                font_size_base: 16,
                font_size_large: 20,
                font_size_small: 14,
            },
            spacing: Spacing {
                small: 8,
                medium: 16,
                large: 24,
            },
            metadata: HashMap::new(),
        }
    }
}

/// Theme engine
pub struct ThemeEngine {
    /// Current theme
    current_theme: Theme,

    /// Available themes
    themes: HashMap<String, Theme>,
}

impl ThemeEngine {
    /// Create a new theme engine
    pub fn new() -> Self {
        let mut themes = HashMap::new();

        // Add default themes
        let light = ThemePreset::Light.to_theme();
        let dark = ThemePreset::Dark.to_theme();
        let blue = ThemePreset::Blue.to_theme();
        let green = ThemePreset::Green.to_theme();
        let purple = ThemePreset::Purple.to_theme();

        themes.insert(light.name.clone(), light);
        themes.insert(dark.name.clone(), dark);
        themes.insert(blue.name.clone(), blue);
        themes.insert(green.name.clone(), green);
        themes.insert(purple.name.clone(), purple);

        let current_theme = ThemePreset::Light.to_theme();

        Self {
            current_theme,
            themes,
        }
    }

    /// Set the current theme
    pub fn set_theme(&mut self, name: &str) -> std::result::Result<(), UiUxError> {
        let theme = self
            .themes
            .get(name)
            .ok_or_else(|| UiUxError::ThemeNotFound(name.to_string()))?;
        self.current_theme = theme.clone();
        Ok(())
    }

    /// Get the current theme
    pub fn get_current_theme(&self) -> &Theme {
        &self.current_theme
    }

    /// List all available themes
    pub fn list_themes(&self) -> Vec<&Theme> {
        self.themes.values().collect()
    }

    /// Add a custom theme
    pub fn add_theme(&mut self, theme: Theme) {
        self.themes.insert(theme.name.clone(), theme);
    }
}

impl Default for ThemeEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_theme_engine_creation() {
        let engine = ThemeEngine::new();
        assert_eq!(engine.themes.len(), 5);
    }

    #[test]
    fn test_set_theme() {
        let mut engine = ThemeEngine::new();
        engine.set_theme("Dark").unwrap();
        assert_eq!(engine.get_current_theme().name, "Dark");
    }

    #[test]
    fn test_set_nonexistent_theme() {
        let mut engine = ThemeEngine::new();
        let result = engine.set_theme("Nonexistent");
        assert!(result.is_err());
    }

    #[test]
    fn test_light_theme() {
        let theme = ThemePreset::Light.to_theme();
        assert_eq!(theme.name, "Light");
        assert_eq!(theme.mode, ThemeMode::Light);
    }

    #[test]
    fn test_dark_theme() {
        let theme = ThemePreset::Dark.to_theme();
        assert_eq!(theme.name, "Dark");
        assert_eq!(theme.mode, ThemeMode::Dark);
    }
}
