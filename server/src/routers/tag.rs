use crate::handlers::tag::{create_tag, delete_tag, get_tag, list_tags, update_tag};
use axum::Router;
use axum::routing::{get, post};

/// 标签相关路由
pub fn create_tag_router() -> Router {
    Router::new()
        .route("/tag", post(create_tag).get(list_tags))
        .route("/tag/{id}", get(get_tag).put(update_tag).delete(delete_tag))
}
