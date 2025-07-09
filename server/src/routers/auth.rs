use crate::handlers::auth::{
    login, register, reset_password, token_login, upload_avatar, verification_code,
};
use axum::Router;
use axum::routing::{get, post, put};

pub fn create_auth_router() -> Router {
    Router::new()
        .route("/auth/verification-code", post(verification_code))
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        .route("/auth/jwt-login", get(token_login))
        .route("/auth/reset-password", put(reset_password))
        .route("/auth/profile/avatar", put(upload_avatar))
}
