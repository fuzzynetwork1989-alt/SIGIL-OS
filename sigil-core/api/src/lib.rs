//! SIGIL OS API Library
//!
//! This library provides HTTP API and CLI interfaces for SIGIL OS.

pub mod http;
pub mod webauthn;

#[cfg(feature = "cli")]
pub mod cli;
