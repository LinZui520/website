use crate::AppState;
use crate::core::journal::journal_request;
use crate::routers::auth::create_auth_router;
use crate::routers::blog::create_blog_router;
use crate::routers::category::create_category_router;
use crate::routers::photo::create_photo_router;
use crate::routers::picture::create_picture_router;
use crate::routers::user::create_user_router;
use axum::{Extension, Router, middleware};
use std::sync::Arc;

mod auth;
mod blog;
mod category;
mod photo;
mod picture;
mod user;

pub fn create_app_router(state: Arc<AppState>) -> Router {
    Router::new()
        .nest("/api", create_auth_router())
        .nest("/api", create_user_router())
        .nest("/api", create_category_router())
        .nest("/api", create_blog_router())
        .nest("/api", create_picture_router())
        .nest("/api", create_photo_router())
        .layer(Extension(state))
        .layer(middleware::from_fn(journal_request))
}
