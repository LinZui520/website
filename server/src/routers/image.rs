use crate::handlers::image::{delete_image, list_images, upload_image};
use axum::Router;
use axum::routing::{delete, get, post};

pub fn create_image_router() -> Router {
    Router::new()
        .route("/image/upload", post(upload_image))
        .route("/image/list", get(list_images))
        .route("/image/delete/{id}", delete(delete_image))
}
