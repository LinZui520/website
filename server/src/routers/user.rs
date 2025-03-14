use crate::handlers::user::{jwt, login, register, verify_code};
use axum::Router;
use axum::routing::{get, post};

pub fn create_user_router() -> Router {
    Router::new()
        .route("/user/code", post(verify_code))
        .route("/user/register", post(register))
        .route("/user/login", post(login))
        .route("/user/jwt", get(jwt))
}
