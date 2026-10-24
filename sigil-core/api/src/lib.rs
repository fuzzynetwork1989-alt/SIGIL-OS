//! SIGIL OS API Library
//!
//! This library provides HTTP API and CLI interfaces for SIGIL OS.

pub mod conversation;
pub mod http;
pub mod retry;
pub mod webauthn;

#[cfg(feature = "cli")]
pub mod cli;

#[cfg(feature = "cli")]
pub use cli::run;
