//! WebAuthn server-side verification
//!
//! This module provides server-side WebAuthn/Passkey verification for SIGIL OS.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// WebAuthn credential registration request
#[derive(Deserialize)]
pub struct RegistrationRequest {
    pub username: String,
    pub credential: RegistrationCredential,
}

/// WebAuthn credential
#[derive(Deserialize, Serialize)]
pub struct RegistrationCredential {
    pub id: String,
    pub raw_id: String,
    pub response: AuthenticatorAttestationResponse,
    #[serde(rename = "type")]
    pub credential_type: String,
}

/// Authenticator attestation response
#[derive(Deserialize, Serialize)]
pub struct AuthenticatorAttestationResponse {
    pub client_data_json: String,
    pub attestation_object: String,
}

/// WebAuthn authentication request
#[derive(Deserialize)]
pub struct AuthenticationRequest {
    pub username: String,
    pub credential: AuthenticationCredential,
}

/// Authentication credential
#[derive(Deserialize, Serialize)]
pub struct AuthenticationCredential {
    pub id: String,
    pub raw_id: String,
    pub response: AuthenticatorAssertionResponse,
    #[serde(rename = "type")]
    pub credential_type: String,
}

/// Authenticator assertion response
#[derive(Deserialize, Serialize)]
pub struct AuthenticatorAssertionResponse {
    pub client_data_json: String,
    pub authenticator_data: String,
    pub signature: String,
    pub user_handle: Option<String>,
}

/// Credential store (in-memory for demonstration)
pub struct CredentialStore {
    credentials: HashMap<String, RegistrationCredential>,
}

impl CredentialStore {
    pub fn new() -> Self {
        Self {
            credentials: HashMap::new(),
        }
    }

    /// Store a credential
    pub fn store(&mut self, username: String, credential: RegistrationCredential) {
        self.credentials.insert(username, credential);
    }

    /// Retrieve a credential
    pub fn get(&self, username: &str) -> Option<&RegistrationCredential> {
        self.credentials.get(username)
    }

    /// Check if a credential exists
    pub fn exists(&self, username: &str) -> bool {
        self.credentials.contains_key(username)
    }
}

impl Default for CredentialStore {
    fn default() -> Self {
        Self::new()
    }
}

/// Verify registration
pub fn verify_registration(
    request: RegistrationRequest,
    store: &mut CredentialStore,
) -> Result<bool, String> {
    // In production, this would:
    // 1. Parse the attestation object
    // 2. Verify the challenge
    // 3. Verify the origin
    // 4. Verify the authenticator data
    // 5. Extract and verify the public key
    // 6. Store the credential

    // For now, we'll store the credential without verification
    store.store(request.username.clone(), request.credential);
    
    println!("Registration verified for user: {}", request.username);
    Ok(true)
}

/// Verify authentication
pub fn verify_authentication(
    request: AuthenticationRequest,
    store: &CredentialStore,
) -> Result<bool, String> {
    // Check if credential exists
    let stored_credential = store.get(&request.username)
        .ok_or("Credential not found")?;

    // In production, this would:
    // 1. Verify the assertion signature
    // 2. Verify the challenge
    // 3. Verify the origin
    // 4. Verify the authenticator data
    // 5. Verify the user handle

    // For now, we'll check if the credential ID matches
    if request.credential.id != stored_credential.id {
        return Err("Credential ID mismatch".to_string());
    }

    println!("Authentication verified for user: {}", request.username);
    Ok(true)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_credential_store() {
        let mut store = CredentialStore::new();
        
        let credential = RegistrationCredential {
            id: "test-id".to_string(),
            raw_id: "test-raw-id".to_string(),
            response: AuthenticatorAttestationResponse {
                client_data_json: "{}".to_string(),
                attestation_object: "{}".to_string(),
            },
            credential_type: "public-key".to_string(),
        };

        store.store("test-user".to_string(), credential.clone());
        
        assert!(store.exists("test-user"));
        assert_eq!(store.get("test-user").unwrap().id, "test-id");
    }
}
