use crate::handlers::blog::{create_blog, delete_blog, get_blog, list_blog, update_blog};
use axum::Router;
use axum::routing::{delete, get, post, put};

pub fn create_blog_router() -> Router {
    Router::new()
        .route("/blog/create", post(create_blog))
        .route("/blog/delete/{id}", delete(delete_blog))
        .route("/blog/update", put(update_blog))
        .route("/blog/list", get(list_blog))
        .route("/blog/get/{id}", get(get_blog))
}
