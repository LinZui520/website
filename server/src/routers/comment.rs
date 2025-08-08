use crate::AppState;
use crate::controllers::comment::{create_comment, delete_comment, read_comment};
use axum::Router;
use axum::routing::{delete, get, post};
use std::sync::Arc;

/// 创建评论相关的路由配置
///
/// 路由结构：
/// - POST   /comment                    - 创建评论
/// - GET    /comment/target/{target_id} - 查询指定目标下的所有评论
/// - DELETE /comment/{comment_id}       - 删除指定评论（递归删除子评论）
pub fn create_comment_router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/comment", post(create_comment))
        .route("/comment/target/{target_id}", get(read_comment))
        .route("/comment/{comment_id}", delete(delete_comment))
}
