use crate::handlers::photo::{delete_photo, list_photos, upload_photo};
use axum::Router;
use axum::routing::{delete, get, post};

pub fn create_photo_router() -> Router {
    Router::new()
        .route("/photo/upload", post(upload_photo))
        .route("/photo/list", get(list_photos))
        .route("/photo/delete/{id}", delete(delete_photo))
}
