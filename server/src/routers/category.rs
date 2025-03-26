use crate::handlers::category::{
    create_category, delete_category, get_category, list_categories, update_category,
};
use axum::Router;
use axum::routing::{delete, get, post, put};

pub fn create_category_router() -> Router {
    Router::new()
        .route("/category/create", post(create_category))
        .route("/category/delete/{id}", delete(delete_category))
        .route("/category/update", put(update_category))
        .route("/category/list", get(list_categories))
        .route("/category/get/{id}", get(get_category))
}
