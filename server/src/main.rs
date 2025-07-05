use lettre::{AsyncSmtpTransport, Tokio1Executor};
use sea_orm::DatabaseConnection;

mod core;
mod handlers;
mod models;
mod routers;

#[derive(Clone)]
struct AppState {
    postgres: DatabaseConnection,
    redis: deadpool_redis::Pool,
    mailer: AsyncSmtpTransport<Tokio1Executor>,
}

#[tokio::main]
async fn main() {
    // 初始化环境变量
    core::env::init_env();

    // 初始化异步日志系统
    let _guard = core::journal::init_async_journal();

    // 创建 SeaORM Postgres 连接
    let postgres = core::postgres::establish_postgres_connection().await;

    let redis = core::redis::establish_redis_connection();

    // 创建邮件发送
    let mailer = core::mail::create_mailer();

    let state = std::sync::Arc::new(AppState {
        postgres,
        redis,
        mailer,
    });

    let app = routers::create_app_router(state);
    let address = format!(
        "{}:{}",
        core::env::env("WEBSITE_HOST"),
        core::env::env("WEBSITE_PORT")
    );

    let listener = tokio::net::TcpListener::bind(address).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
