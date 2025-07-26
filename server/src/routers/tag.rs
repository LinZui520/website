use crate::AppState;
use crate::controllers::tag::{create_tag, delete_tag, read_tag, read_tag_by_id, update_tag};
use axum::Router;
use axum::routing::{delete, get, post, put};
use std::sync::Arc;

pub fn create_tag_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/tag", post(create_tag))
        .route("/tag", get(read_tag))
        .route("/tag/{tag_id}", get(read_tag_by_id))
        .route("/tag/{tag_id}", put(update_tag))
        .route("/tag/{tag_id}", delete(delete_tag))
}
