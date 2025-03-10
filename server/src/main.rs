use lettre::{AsyncSmtpTransport, Tokio1Executor};

mod core;
mod handlers;
mod models;
mod routers;

#[derive(Clone)]
struct AppState {
    postgres_pool: deadpool_postgres::Pool,
    redis_pool: deadpool_redis::Pool,
    mailer: AsyncSmtpTransport<Tokio1Executor>,
}

#[tokio::main]
async fn main() {
    // 初始化环境变量
    core::env::init_env();

    // 初始化异步日志系统
    let _guard = core::journal::init_async_journal();

    // 创建 Postgres 连接池
    let postgres_pool = core::postgres::create_postgres_pool();

    // 创建 Redis 连接池
    let redis_pool = core::redis::create_redis_pool();

    // 创建邮件发送
    let mailer = core::mail::create_mailer();

    let state = std::sync::Arc::new(AppState {
        postgres_pool,
        redis_pool,
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
