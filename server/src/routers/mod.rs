use crate::AppState;
use crate::routers::user::create_user_router;
use axum::{Extension, Router};
use std::sync::Arc;

pub mod user;
pub fn create_app_router(state: Arc<AppState>) -> Router {
    Router::new()
        .nest("/api", create_user_router())
        .layer(Extension(state))
}
