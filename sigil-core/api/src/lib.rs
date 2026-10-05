//! SIGIL OS API Library
//!
//! This library provides HTTP API and CLI interfaces for SIGIL OS.

pub mod http;

#[cfg(feature = "cli")]
pub mod cli;
