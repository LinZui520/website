use crate::AppState;
use crate::controllers::picture::{create_picture, delete_picture, read_picture};
use axum::Router;
use axum::routing::{delete, get, post};
use std::sync::Arc;

pub fn create_picture_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/picture", post(create_picture))
        .route("/picture", get(read_picture))
        .route("/picture/{picture_id}", delete(delete_picture))
}
