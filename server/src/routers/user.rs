use crate::handlers::user::{decrease_user_permission, increase_user_permission, list_users};
use axum::Router;
use axum::routing::{get, put};

pub fn create_user_router() -> Router {
    Router::new()
        .route("/user/list", get(list_users))
        .route("/user/increase/{id}", put(increase_user_permission))
        .route("/user/decrease/{id}", put(decrease_user_permission))
}
