//! Icon system for SIGIL OS
//!
//! This module provides icon pack loading, rendering, and management.

use std::collections::HashMap;
use uuid::Uuid;

/// Icon representation
#[derive(Debug, Clone)]
pub struct Icon {
    /// Icon ID
    pub id: Uuid,

    /// Icon name
    pub name: String,

    /// Icon category (e.g., "navigation", "action", "status")
    pub category: String,

    /// Icon data (SVG, PNG bytes, etc.)
    pub data: Vec<u8>,

    /// Icon format (svg, png, etc.)
    pub format: IconFormat,
}

/// Icon format
#[derive(Debug, Clone, Copy)]
pub enum IconFormat {
    Svg,
    Png,
    Jpeg,
    Ico,
}

/// Icon pack
#[derive(Debug, Clone)]
pub struct IconPack {
    /// Pack name
    pub name: String,

    /// Pack version
    pub version: String,

    /// Icons in the pack
    pub icons: HashMap<String, Icon>,

    /// Pack metadata
    pub metadata: HashMap<String, String>,
}

/// Icon pack loader
pub struct IconPackLoader;

impl IconPackLoader {
    /// Load an icon pack from a directory
    pub fn load_from_directory(path: &str) -> std::result::Result<IconPack, crate::UiUxError> {
        // TODO: Implement actual directory loading
        // This would scan the directory for icon files and load them
        let mut icons = HashMap::new();

        // Placeholder: create a minimal icon pack
        let default_icon = Icon {
            id: Uuid::new_v4(),
            name: "default".to_string(),
            category: "misc".to_string(),
            data: vec![],
            format: IconFormat::Svg,
        };

        icons.insert("default".to_string(), default_icon);

        Ok(IconPack {
            name: "default".to_string(),
            version: "1.0".to_string(),
            icons,
            metadata: HashMap::new(),
        })
    }

    /// Load an icon pack from an embedded resource
    pub fn load_embedded(name: &str) -> std::result::Result<IconPack, crate::UiUxError> {
        // TODO: Implement embedded resource loading using rust-embed
        Self::load_from_directory(name)
    }

    /// Create a default icon pack
    pub fn create_default() -> IconPack {
        let mut icons = HashMap::new();

        // Add some default icons
        let home_icon = Icon {
            id: Uuid::new_v4(),
            name: "home".to_string(),
            category: "navigation".to_string(),
            data: vec![],
            format: IconFormat::Svg,
        };

        let settings_icon = Icon {
            id: Uuid::new_v4(),
            name: "settings".to_string(),
            category: "action".to_string(),
            data: vec![],
            format: IconFormat::Svg,
        };

        icons.insert("home".to_string(), home_icon);
        icons.insert("settings".to_string(), settings_icon);

        IconPack {
            name: "default".to_string(),
            version: "1.0".to_string(),
            icons,
            metadata: HashMap::new(),
        }
    }
}

impl IconPack {
    /// Get an icon by name
    pub fn get_icon(&self, name: &str) -> Option<&Icon> {
        self.icons.get(name)
    }

    /// List all icons
    pub fn list_icons(&self) -> Vec<&Icon> {
        self.icons.values().collect()
    }

    /// List icons by category
    pub fn list_icons_by_category(&self, category: &str) -> Vec<&Icon> {
        self.icons
            .values()
            .filter(|icon| icon.category == category)
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_icon_pack() {
        let pack = IconPackLoader::create_default();
        assert_eq!(pack.name, "default");
        assert_eq!(pack.icons.len(), 2);
    }

    #[test]
    fn test_get_icon() {
        let pack = IconPackLoader::create_default();
        let icon = pack.get_icon("home");
        assert!(icon.is_some());
        assert_eq!(icon.unwrap().name, "home");
    }

    #[test]
    fn test_list_icons() {
        let pack = IconPackLoader::create_default();
        let icons = pack.list_icons();
        assert_eq!(icons.len(), 2);
    }

    #[test]
    fn test_list_icons_by_category() {
        let pack = IconPackLoader::create_default();
        let navigation_icons = pack.list_icons_by_category("navigation");
        assert_eq!(navigation_icons.len(), 1);
    }
}
