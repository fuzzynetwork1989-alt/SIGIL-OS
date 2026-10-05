//! SIGIL OS Persistence Library
//!
//! This library provides persistence layer for SIGIL OS, including
//! append-only ledger and storage.

pub mod ledger;
pub mod store;

pub use ledger::Ledger;
pub use store::Store;
