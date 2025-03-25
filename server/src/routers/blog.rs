use crate::handlers::blog::{create_blog, delete_blog};
use axum::Router;
use axum::routing::{delete, post};

pub fn create_blog_router() -> Router {
    Router::new()
        .route("/blog/create", post(create_blog))
        .route("/blog/delete/{id}", delete(delete_blog))
}
