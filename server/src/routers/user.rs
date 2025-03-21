use crate::handlers::category::{
    create_category, delete_category, list_categories, update_category,
};
use crate::handlers::user::{login, register, reset_password, token_login, verification_code};
use axum::Router;
use axum::routing::{delete, get, post, put};

pub fn create_user_router() -> Router {
    Router::new()
        .route("/user/verification-code", post(verification_code))
        .route("/user/register", post(register))
        .route("/user/login", post(login))
        .route("/user/jwt-login", get(token_login))
        .route("/user/reset-password", put(reset_password))
}

pub fn create_category_router() -> Router {
    Router::new()
        .route("/category/create", post(create_category))
        .route("/category/delete", delete(delete_category))
        .route("/category/update", put(update_category))
        .route("/category/list", get(list_categories))
}
