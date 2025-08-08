use axum::{Router, middleware};
use std::sync::Arc;

pub mod auth;
pub mod blog;
pub mod board;
pub mod comment;
pub mod photo;
pub mod picture;
pub mod tag;
pub mod user;

use crate::AppState;
use crate::core::journal::journal_request;
use crate::routers::auth::create_auth_router;
use crate::routers::board::create_board_router;
use crate::routers::comment::create_comment_router;
use crate::routers::photo::create_photo_router;
use crate::routers::picture::create_picture_router;
use crate::routers::user::create_user_router;
use crate::routers::{blog::create_blog_router, tag::create_tag_router};

pub fn create_app_router(state: Arc<AppState>) -> Router {
    Router::new()
        .nest("/api", create_auth_router())
        .nest("/api", create_user_router())
        .nest("/api", create_board_router())
        .nest("/api", create_comment_router())
        .nest("/api", create_photo_router())
        .nest("/api", create_picture_router())
        .nest("/api", create_tag_router())
        .nest("/api", create_blog_router())
        .layer(middleware::from_fn(journal_request))
        .with_state(state)
}
