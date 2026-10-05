//! Append-only ledger for sigils
//!
//! The ledger is an append-only event log that records all sigils.
//! Once a sigil is written to the ledger, it cannot be modified or deleted.

use rusqlite::{params, Connection};
use sigil::Sigil;
use uuid::Uuid;

/// Append-only ledger for sigils
pub struct Ledger {
    conn: Connection,
}

impl Ledger {
    /// Open or create a ledger at the given path
    pub fn open(path: &str) -> anyhow::Result<Self> {
        let conn = Connection::open(path)?;
        let ledger = Self { conn };
        ledger.init_schema()?;
        Ok(ledger)
    }

    /// Initialize the ledger schema
    fn init_schema(&self) -> anyhow::Result<()> {
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS sigils (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                signature TEXT NOT NULL,
                issued_at TEXT NOT NULL,
                expires_at TEXT
            )",
            [],
        )?;

        // Create index on issued_at for time-based queries
        self.conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_sigils_issued_at ON sigils(issued_at)",
            [],
        )?;

        Ok(())
    }

    /// Append a sigil to the ledger
    ///
    /// This is append-only - once written, a sigil cannot be modified or deleted.
    pub fn append(&self, sigil: &Sigil) -> anyhow::Result<()> {
        let data = serde_json::to_string(sigil)?;
        let signature_str = format!(
            "{}:{}",
            hex::encode(&sigil.signature.bytes),
            hex::encode(&sigil.signature.public_key)
        );
        let issued_at = sigil.issued_at.to_rfc3339();
        let expires_at = sigil.expires_at.map(|t| t.to_rfc3339());

        self.conn.execute(
            "INSERT INTO sigils (id, data, signature, issued_at, expires_at) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                sigil.id.to_string(),
                data,
                signature_str,
                issued_at,
                expires_at
            ],
        )?;

        Ok(())
    }

    /// Retrieve a sigil by ID
    pub fn get(&self, id: Uuid) -> anyhow::Result<Option<Sigil>> {
        let mut stmt = self.conn.prepare("SELECT data FROM sigils WHERE id = ?1")?;
        let mut rows = stmt.query(params![id.to_string()])?;

        if let Some(row) = rows.next()? {
            let data: String = row.get(0)?;
            let sigil: Sigil = serde_json::from_str(&data)?;
            Ok(Some(sigil))
        } else {
            Ok(None)
        }
    }

    /// Retrieve all sigils
    pub fn get_all(&self) -> anyhow::Result<Vec<Sigil>> {
        let mut stmt = self.conn.prepare("SELECT data FROM sigils ORDER BY issued_at")?;
        let rows = stmt.query_map([], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })?;

        let mut sigils = Vec::new();
        for row in rows {
            let data = row?;
            let sigil: Sigil = serde_json::from_str(&data)?;
            sigils.push(sigil);
        }

        Ok(sigils)
    }

    /// Get the count of sigils in the ledger
    pub fn count(&self) -> anyhow::Result<u64> {
        let mut stmt = self.conn.prepare("SELECT COUNT(*) FROM sigils")?;
        let mut rows = stmt.query([])?;

        if let Some(row) = rows.next()? {
            let count: u64 = row.get(0)?;
            Ok(count)
        } else {
            Ok(0)
        }
    }

    /// Verify ledger integrity
    ///
    /// This checks that all sigils in the ledger can be deserialized
    /// and that their signatures are valid.
    pub fn verify_integrity(&self) -> anyhow::Result<bool> {
        let sigils = self.get_all()?;

        for sigil in &sigils {
            // Verify deserialization (already done by get_all)
            // Verify signature
            if !sigil::verification::SigilVerifier::verify(sigil)? {
                return Ok(false);
            }
        }

        Ok(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use sigil::{AttestedIdentity, EpistemicStatus, HalfLife, Provenance, RollbackKey, SigilKind, Ed25519Signature};
    use tempfile::NamedTempFile;

    #[test]
    fn test_ledger_creation() {
        let temp_file = NamedTempFile::new().unwrap();
        let ledger = Ledger::open(temp_file.path().to_str().unwrap()).unwrap();
        assert_eq!(ledger.count().unwrap(), 0);
    }

    #[test]
    fn test_ledger_append() {
        let temp_file = NamedTempFile::new().unwrap();
        let ledger = Ledger::open(temp_file.path().to_str().unwrap()).unwrap();

        let sigil = Sigil {
            id: Uuid::new_v4(),
            actor: AttestedIdentity {
                device_id: Uuid::new_v4(),
                actor_id: Uuid::new_v4(),
                attestation: vec![1, 2, 3],
            },
            kind: SigilKind::Belief {
                proposition: "test proposition".to_string(),
                confidence: 0.9,
                half_life: HalfLife { seconds: 3600 },
                epistemic_status: EpistemicStatus::Active,
            },
            provenance: Provenance {
                parents: vec![],
                inputs: vec![],
                sources: vec![],
            },
            warrant: None,
            rollback: RollbackKey {
                id: Uuid::new_v4(),
                data: vec![],
            },
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: chrono::Utc::now(),
            expires_at: None,
        };

        ledger.append(&sigil).unwrap();
        assert_eq!(ledger.count().unwrap(), 1);
    }

    #[test]
    fn test_ledger_retrieve() {
        let temp_file = NamedTempFile::new().unwrap();
        let ledger = Ledger::open(temp_file.path().to_str().unwrap()).unwrap();

        let sigil = Sigil {
            id: Uuid::new_v4(),
            actor: AttestedIdentity {
                device_id: Uuid::new_v4(),
                actor_id: Uuid::new_v4(),
                attestation: vec![1, 2, 3],
            },
            kind: SigilKind::Belief {
                proposition: "test proposition".to_string(),
                confidence: 0.9,
                half_life: HalfLife { seconds: 3600 },
                epistemic_status: EpistemicStatus::Active,
            },
            provenance: Provenance {
                parents: vec![],
                inputs: vec![],
                sources: vec![],
            },
            warrant: None,
            rollback: RollbackKey {
                id: Uuid::new_v4(),
                data: vec![],
            },
            signature: Ed25519Signature {
                bytes: vec![0u8; 64],
                public_key: vec![0u8; 32],
            },
            issued_at: chrono::Utc::now(),
            expires_at: None,
        };

        let id = sigil.id;
        ledger.append(&sigil).unwrap();

        let retrieved = ledger.get(id).unwrap();
        assert!(retrieved.is_some());
        assert_eq!(retrieved.unwrap().id, id);
    }
}
