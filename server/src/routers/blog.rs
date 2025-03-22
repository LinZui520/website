use crate::handlers::blog::create_blog;
use axum::Router;
use axum::routing::post;

pub fn create_blog_router() -> Router {
    Router::new().route("/blog/create", post(create_blog))
}
