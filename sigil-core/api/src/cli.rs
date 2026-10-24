//! CLI interface for SIGIL OS
//!
//! This module provides the command-line interface for SIGIL OS.

use clap::{Parser, Subcommand};
use std::net::SocketAddr;
use std::sync::Arc;
use hex;

/// SIGIL OS - The Post-AI Operating System with Cryptographic Warrant
#[derive(Parser, Debug)]
#[command(name = "sigil")]
#[command(about = "SIGIL OS - The Post-AI Operating System with Cryptographic Warrant", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Check system health
    Health {
        /// Address to connect to (default: http://localhost:8080)
        #[arg(short, long, default_value = "http://localhost:8080")]
        addr: String,
    },
    /// Start the API server
    Serve {
        /// Address to bind to (default: 0.0.0.0:8080)
        #[arg(short, long, default_value = "0.0.0.0:8080")]
        addr: String,
    },
    /// Query the cryptographic ledger
    Ledger {
        #[command(subcommand)]
        ledger_cmd: LedgerCommands,
    },
    /// Generate and verify cryptographic sigils
    Sigil {
        #[command(subcommand)]
        sigil_cmd: SigilCommands,
    },
    /// Show system status and configuration
    Status {
        /// Show detailed status
        #[arg(short, long)]
        detailed: bool,
    },
}

#[derive(Subcommand, Debug)]
enum LedgerCommands {
    /// List all ledger entries
    List {
        /// Maximum number of entries to show
        #[arg(short, long, default_value = "10")]
        limit: usize,
    },
    /// Show a specific ledger entry by ID
    Show {
        /// Entry ID
        id: String,
    },
    /// Verify ledger integrity
    Verify,
}

#[derive(Subcommand, Debug)]
enum SigilCommands {
    /// Generate a new cryptographic sigil
    Generate {
        /// Data to sign
        data: String,
    },
    /// Verify a sigil signature
    Verify {
        /// Original data
        data: String,
        /// Signature to verify
        signature: String,
        /// Public key (hex encoded)
        public_key: String,
    },
    /// Generate a new key pair
    Keygen,
}

/// Run the CLI
pub async fn run() -> anyhow::Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Health { addr } => {
            let client = reqwest::Client::new();
            let response = client.get(&format!("{}/health", addr))
                .send()
                .await?;

            if response.status().is_success() {
                let health: serde_json::Value = response.json().await?;
                println!("✅ SIGIL OS Health Check");
                println!("Status: {}", health["status"]);
                println!("Version: {}", health["version"]);
                println!("Timestamp: {}", health["timestamp"]);
                println!("Super Brain: {}", health["superbrain_enabled"]);
                Ok(())
            } else {
                anyhow::bail!("Health check failed with status: {}", response.status());
            }
        }
        Commands::Serve { addr } => {
            let addr: SocketAddr = addr.parse()?;
            let state = super::http::ApiState {
                version: env!("CARGO_PKG_VERSION").to_string(),
                superbrain_enabled: true,
                conversation_store: Arc::new(super::conversation::ConversationStore::new()),
            };
            super::http::serve(addr, state).await?;
            Ok(())
        }
        Commands::Ledger { ledger_cmd } => {
            match ledger_cmd {
                LedgerCommands::List { limit } => {
                    println!("📜 Ledger Entries (last {})", limit);
                    println!("Ledger integration pending - persistence layer not yet connected to CLI");
                    Ok(())
                }
                LedgerCommands::Show { id } => {
                    println!("📜 Ledger Entry: {}", id);
                    println!("Ledger integration pending - persistence layer not yet connected to CLI");
                    Ok(())
                }
                LedgerCommands::Verify => {
                    println!("🔍 Verifying Ledger Integrity");
                    println!("Ledger integration pending - persistence layer not yet connected to CLI");
                    Ok(())
                }
            }
        }
        Commands::Sigil { sigil_cmd } => {
            match sigil_cmd {
                SigilCommands::Generate { data } => {
                    use sigil::signing::{KeyPair, SigilSigner};
                    use sigil::sigil::{AttestedIdentity, EpistemicStatus, HalfLife, Provenance, RollbackKey, Sigil, SigilKind, Ed25519Signature};
                    use uuid::Uuid;
                    use chrono::Utc;

                    let key_pair = KeyPair::generate();
                    let signer = SigilSigner::with_key_pair(key_pair.clone());

                    let sigil = Sigil {
                        id: Uuid::new_v4(),
                        actor: AttestedIdentity {
                            device_id: Uuid::new_v4(),
                            actor_id: Uuid::new_v4(),
                            attestation: vec![],
                        },
                        kind: SigilKind::Belief {
                            proposition: data.clone(),
                            confidence: 1.0,
                            half_life: HalfLife { seconds: 86400 },
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
                        issued_at: Utc::now(),
                        expires_at: None,
                    };

                    let signature = signer.sign(&sigil)?;

                    println!("🔐 New Sigil Generated");
                    println!("Data: {}", data);
                    println!("Signature: {}", hex::encode(signature.bytes));
                    println!("Public Key: {}", hex::encode(signature.public_key));
                    Ok(())
                }
                SigilCommands::Verify { data, signature, public_key } => {
                    use ed25519_dalek::{VerifyingKey, Signature, Verifier};

                    let sig_bytes = hex::decode(signature)
                        .map_err(|e| anyhow::anyhow!("Invalid signature hex: {}", e))?;
                    let pub_bytes = hex::decode(public_key)
                        .map_err(|e| anyhow::anyhow!("Invalid public key hex: {}", e))?;

                    let sig_bytes_array: [u8; 64] = sig_bytes.try_into()
                        .map_err(|_| anyhow::anyhow!("Invalid signature length"))?;
                    let pub_bytes_array: [u8; 32] = pub_bytes.try_into()
                        .map_err(|_| anyhow::anyhow!("Invalid public key length"))?;

                    let signature = Signature::from_bytes(&sig_bytes_array);
                    let verifying_key = VerifyingKey::from_bytes(&pub_bytes_array)
                        .map_err(|e| anyhow::anyhow!("Invalid public key: {}", e))?;

                    let data_bytes = data.as_bytes();
                    let is_valid = verifying_key.verify(data_bytes, &signature).is_ok();

                    if is_valid {
                        println!("✅ Signature Verification: VALID");
                    } else {
                        println!("❌ Signature Verification: INVALID");
                    }
                    Ok(())
                }
                SigilCommands::Keygen => {
                    use sigil::signing::KeyPair;

                    let key_pair = KeyPair::generate();

                    println!("🔑 New Ed25519 Key Pair Generated");
                    println!("Public Key: {}", hex::encode(key_pair.public_key_bytes()));
                    println!("\n⚠️  Secret key is kept in memory - export securely if needed");
                    Ok(())
                }
            }
        }
        Commands::Status { detailed } => {
            println!("📊 SIGIL OS Status");
            println!("Version: {}", env!("CARGO_PKG_VERSION"));

            if detailed {
                println!("\n📦 Components:");
                println!("  - Sigil Core: cryptographic primitives");
                println!("  - Persistence: SQLite ledger");
                println!("  - API: HTTP server + CLI");
                println!("  - Memory: in-progress");
                println!("  - Retrieval: in-progress");
                println!("\n🧠 Features:");
                println!("  - Cryptographic Warrants: Phase 1");
                println!("  - Noetic Substrate: Phase 2");
                println!("  - Anchor Governance: Phase 3");
                println!("  - Inference Kernel: Phase 4");
                println!("  - Cognitive Runtime: Phase 5");
                println!("  - Experience Surfaces: Phase 6");
            }
            Ok(())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cli_parsing() {
        let cli = Cli::try_parse_from(["sigil", "health"]).unwrap();
        matches!(cli.command, Commands::Health { .. });
    }
}
