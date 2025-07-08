use crate::handlers::picture::{delete_picture, list_pictures, upload_picture};
use axum::Router;
use axum::routing::{delete, get, post};

pub fn create_picture_router() -> Router {
    Router::new()
        .route("/picture/upload", post(upload_picture))
        .route("/picture/list", get(list_pictures))
        .route("/picture/delete/{id}", delete(delete_picture))
}
