use crate::AppState;
use crate::controllers::user::{decrease_user_permission, increase_user_permission, list_users};
use axum::Router;
use axum::routing::{get, put};
use std::sync::Arc;

pub fn create_user_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/user", get(list_users))
        .route("/user/increase/{id}", put(increase_user_permission))
        .route("/user/decrease/{id}", put(decrease_user_permission))
}
