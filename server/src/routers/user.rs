use crate::handlers::user::{login, register, reset_password, token_login, verification_code};
use axum::Router;
use axum::routing::{get, post, put};

pub fn create_user_router() -> Router {
    Router::new()
        .route("/user/verification-code", post(verification_code))
        .route("/user/register", post(register))
        .route("/user/login", post(login))
        .route("/user/jwt-login", get(token_login))
        .route("/user/reset-password", put(reset_password))
}
