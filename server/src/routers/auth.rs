use crate::AppState;
use crate::controllers::auth::{
    jwt_login, login, register, reset_password, update_username, upload_avatar, verification_code,
};
use axum::Router;
use axum::routing::{get, post, put};
use std::sync::Arc;

pub fn create_auth_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/auth/verification-code", post(verification_code))
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        .route("/auth/jwt-login", get(jwt_login))
        .route("/auth/reset-password", put(reset_password))
        .route("/auth/profile/avatar", put(upload_avatar))
        .route("/auth/profile/username", put(update_username))
}
