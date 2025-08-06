use crate::AppState;
use crate::controllers::board::{create_board, delete_board, read_board, update_board};
use axum::Router;
use axum::routing::{delete, get, post, put};
use std::sync::Arc;

pub fn create_board_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/board", post(create_board))
        .route("/board", get(read_board))
        .route("/board/{board_id}", put(update_board))
        .route("/board/{board_id}", delete(delete_board))
}
