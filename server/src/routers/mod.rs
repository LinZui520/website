use crate::AppState;
use crate::core::journal::journal_request;
use crate::routers::user::{create_category_router, create_user_router};
use axum::{Extension, Router, middleware};
use std::sync::Arc;

pub mod user;
pub fn create_app_router(state: Arc<AppState>) -> Router {
    Router::new()
        .nest("/api", create_user_router())
        .nest("/api", create_category_router())
        .layer(Extension(state))
        .layer(middleware::from_fn(journal_request))
}
