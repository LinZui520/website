use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::comment::{CommentDTO, CommentVO};
use crate::models::response::Response;
use crate::models::user::Permission;
use crate::services::comment::CommentService;
use axum::Json;
use axum::extract::{Path, State};
use axum::http::HeaderMap;
use std::sync::Arc;

/// 创建评论处理函数
///
/// 接受JSON格式的评论数据，在数据库中创建评论记录
/// 包括评论内容、目标对象ID和父评论ID（可选）
///
/// 请求体：
/// - content: 评论内容（必需）
/// - target_id: 目标对象ID（必需）
/// - parent_id: 父评论ID（可选，用于回复评论）
pub async fn create_comment(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Json(comment_dto): Json<CommentDTO>,
) -> Response<()> {
    // 权限验证：需要User及以上权限才能创建评论
    let claims = match extract_permissions_from_headers(headers, Permission::User) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层处理评论创建
    handle_service_result!(
        CommentService::create_comment(state, claims.sub, comment_dto).await,
        "评论创建成功"
    )
}

/// 根据target_id查询评论列表处理函数
///
/// 查询指定目标对象下的所有评论，按时间正序排列
/// 无需权限验证，所有人都可以查看评论
///
/// 路径参数：
/// - target_id: 目标对象唯一标识符
pub async fn read_comment(
    State(state): State<Arc<AppState>>,
    Path(target_id): Path<String>,
) -> Response<Vec<CommentVO>> {
    // 调用服务层查询评论列表
    handle_service_result!(
        CommentService::read_comment_by_target(state, target_id).await,
        "评论查询成功"
    )
}

/// 删除评论处理函数
///
/// 删除指定的评论及其所有子评论（递归删除）
/// 权限要求：评论所有者或权限>=2的用户才能删除
///
/// 路径参数：
/// - comment_id: 评论唯一标识符
pub async fn delete_comment(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(comment_id): Path<String>,
) -> Response<()> {
    // 权限验证：需要User及以上权限才能尝试删除评论
    let claims = match extract_permissions_from_headers(headers, Permission::User) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层处理评论删除（服务层会进一步验证是否是评论所有者或管理员）
    handle_service_result!(
        CommentService::delete_comment(state, claims.sub, claims.user.permission, comment_id).await,
        "评论删除成功"
    )
}
