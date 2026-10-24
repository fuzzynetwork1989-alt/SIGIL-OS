//! SIGIL OS CLI Binary
//!
//! Entry point for the SIGIL OS command-line interface.

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    api::cli::run().await
}
