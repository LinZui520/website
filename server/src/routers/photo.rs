use crate::AppState;
use crate::controllers::photo::{create_photo, delete_photo, read_photo, update_photo};
use axum::Router;
use axum::routing::{delete, get, post, put};
use std::sync::Arc;

pub fn create_photo_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/photo", post(create_photo))
        .route("/photo", get(read_photo))
        .route("/photo/{photo_id}", put(update_photo))
        .route("/photo/{photo_id}", delete(delete_photo))
}
