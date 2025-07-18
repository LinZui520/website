use crate::handlers::blog::{
    create_blog, delete_blog, get_blog, list_blogs, list_published_blogs, update_blog,
};
use axum::Router;
use axum::routing::{delete, get, post, put};

pub fn create_blog_router() -> Router {
    Router::new()
        .route("/blog", post(create_blog))
        .route("/blog/{id}", delete(delete_blog))
        .route("/blog/{id}", put(update_blog))
        .route("/blog/published", get(list_published_blogs))
        .route("/blog", get(list_blogs))
        .route("/blog/{id}", get(get_blog))
}
