use crate::core::env::env;
use deadpool_redis::{Config, Pool, Runtime};

pub fn establish_redis_connection() -> Pool {
    let url = format!(
        "redis://{}:{}@{}:{}/",
        env("REDIS_USERNAME"),
        env("REDIS_PASSWORD"),
        env("REDIS_HOST"),
        env("REDIS_PORT")
    );
    let cfg = Config::from_url(url.as_str());

    cfg.create_pool(Some(Runtime::Tokio1)).unwrap_or_else(|_| {
        tracing::error!("Failed to create Redis connection");
        std::process::exit(1)
    })
}
