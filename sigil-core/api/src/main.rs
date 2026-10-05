//! SIGIL OS API binary

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let state = api::http::ApiState {
        version: env!("CARGO_PKG_VERSION").to_string(),
    };
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 8080));
    api::http::serve(addr, state).await
}
