use crate::core::env::env;
use deadpool_postgres::{Config, Pool, Runtime};
use tokio_postgres::NoTls;

pub fn create_postgres_pool() -> Pool {
    let cfg = Config {
        host: Some(env("POSTGRESQL_HOST")),
        port: Some(env("POSTGRESQL_PORT").parse().unwrap()),
        user: Some(env("POSTGRESQL_USERNAME")),
        password: Some(env("POSTGRESQL_PASSWORD")),
        dbname: Some(env("POSTGRESQL_DATABASE")),
        ..Default::default()
    };

    cfg.create_pool(Some(Runtime::Tokio1), NoTls)
        .unwrap_or_else(|_| {
            tracing::error!("Failed to create Postgres connection pool.");
            std::process::exit(0)
        })
}
