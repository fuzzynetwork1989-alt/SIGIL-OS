//! Storage layer for SIGIL OS
//!
//! This module provides a general-purpose storage layer built on SQLite.

use rusqlite::{params, Connection};

/// Storage layer for SIGIL OS
pub struct Store {
    conn: Connection,
}

impl Store {
    /// Open or create a store at the given path
    pub fn open(path: &str) -> anyhow::Result<Self> {
        let conn = Connection::open(path)?;
        let store = Self { conn };
        store.init_schema()?;
        Ok(store)
    }

    /// Initialize the store schema
    fn init_schema(&self) -> anyhow::Result<()> {
        // Create a general key-value table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS kv_store (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            [],
        )?;

        Ok(())
    }

    /// Store a key-value pair
    pub fn set(&self, key: &str, value: &str) -> anyhow::Result<()> {
        let updated_at = chrono::Utc::now().to_rfc3339();
        self.conn.execute(
            "INSERT OR REPLACE INTO kv_store (key, value, updated_at) VALUES (?1, ?2, ?3)",
            params![key, value, updated_at],
        )?;
        Ok(())
    }

    /// Retrieve a value by key
    pub fn get(&self, key: &str) -> anyhow::Result<Option<String>> {
        let mut stmt = self.conn.prepare("SELECT value FROM kv_store WHERE key = ?1")?;
        let mut rows = stmt.query(params![key])?;

        if let Some(row) = rows.next()? {
            let value: String = row.get(0)?;
            Ok(Some(value))
        } else {
            Ok(None)
        }
    }

    /// Delete a key-value pair
    pub fn delete(&self, key: &str) -> anyhow::Result<bool> {
        let rows_affected = self.conn.execute("DELETE FROM kv_store WHERE key = ?1", params![key])?;
        Ok(rows_affected > 0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;

    #[test]
    fn test_store_creation() {
        let temp_file = NamedTempFile::new().unwrap();
        let _store = Store::open(temp_file.path().to_str().unwrap()).unwrap();
        // Store created successfully
    }

    #[test]
    fn test_store_set_get() {
        let temp_file = NamedTempFile::new().unwrap();
        let store = Store::open(temp_file.path().to_str().unwrap()).unwrap();

        store.set("test_key", "test_value").unwrap();
        let value = store.get("test_key").unwrap();
        assert_eq!(value, Some("test_value".to_string()));
    }

    #[test]
    fn test_store_delete() {
        let temp_file = NamedTempFile::new().unwrap();
        let store = Store::open(temp_file.path().to_str().unwrap()).unwrap();

        store.set("test_key", "test_value").unwrap();
        let deleted = store.delete("test_key").unwrap();
        assert!(deleted);

        let value = store.get("test_key").unwrap();
        assert_eq!(value, None);
    }
}
