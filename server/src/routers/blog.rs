use crate::AppState;
use crate::controllers::blog::{
    create_blog, delete_blog, read_blog, read_blog_by_id, read_published_blog, update_blog,
};
use axum::Router;
use axum::routing::{delete, get, post, put};
use std::sync::Arc;

pub fn create_blog_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/blog", post(create_blog))
        .route("/blog", get(read_blog))
        .route("/blog/published", get(read_published_blog))
        .route("/blog/{blog_id}", get(read_blog_by_id))
        .route("/blog/{blog_id}", put(update_blog))
        .route("/blog/{blog_id}", delete(delete_blog))
}
