use crate::core::env::env;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::time::Duration;
use tracing::log;

pub async fn establish_postgres_connection() -> DatabaseConnection {
    let database_url = format!(
        "postgres://{}:{}@{}:{}/{}",
        env("POSTGRESQL_USERNAME"),
        env("POSTGRESQL_PASSWORD"),
        env("POSTGRESQL_HOST"),
        env("POSTGRESQL_PORT"),
        env("POSTGRESQL_DATABASE")
    );

    // 2C4G 生产环境优化配置
    let mut opt = ConnectOptions::new(database_url);

    opt.max_connections(20) // 生产环境支持更多并发用户
        .min_connections(5) // 保持5个热连接，快速响应
        .connect_timeout(Duration::from_secs(10)) // 连接超时10秒
        .acquire_timeout(Duration::from_secs(15)) // 获取连接超时15秒
        .idle_timeout(Duration::from_secs(900)) // 15分钟空闲超时，平衡性能与资源
        .max_lifetime(Duration::from_secs(7200)) // 2小时连接生命周期，保证稳定性
        .sqlx_logging(false) // 生产环境关闭SQL日志，提升性能
        .sqlx_logging_level(log::LevelFilter::Error); // 只记录错误，减少日志量

    // 建立数据库连接
    match Database::connect(opt).await {
        Ok(db) => db,
        Err(err) => {
            tracing::error!("Failed to create SeaORM PostgreSQL connection: {}", err);
            std::process::exit(1);
        }
    }
}
