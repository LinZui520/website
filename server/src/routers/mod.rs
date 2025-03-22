use crate::AppState;
use crate::core::journal::journal_request;
use crate::routers::category::create_category_router;
use crate::routers::user::create_user_router;
use axum::{Extension, Router, middleware};
use std::sync::Arc;
use crate::routers::blog::create_blog_router;

mod category;
pub mod user;
mod blog;

pub fn create_app_router(state: Arc<AppState>) -> Router {
    Router::new()
        .nest("/api", create_user_router())
        .nest("/api", create_category_router())
        .nest("/api", create_blog_router())
        .layer(Extension(state))
        .layer(middleware::from_fn(journal_request))
}
