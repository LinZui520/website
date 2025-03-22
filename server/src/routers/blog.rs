use axum::Router;
use axum::routing::post;
use crate::handlers::blog::create_blog;

pub fn create_blog_router() -> Router {
    Router::new()
        .route("/blog/create", post(create_blog))
}