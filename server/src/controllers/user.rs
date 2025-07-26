use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::response::Response;
use crate::models::user::{Permission, UserVO};
use crate::services::user::UserService;
use axum::extract::Path;
use axum::{extract::State, http::HeaderMap};
use std::sync::Arc;

/// 获取用户列表
///
/// 权限控制：
/// - 需要Master及以上权限(permission >= 2)才能查看所有用户
pub async fn list_users(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> Response<Vec<UserVO>> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    handle_service_result!(UserService::list_users(state).await, "查询用户列表成功")
}

/// 提升用户权限
///
/// 权限控制：
/// - 需要Master及以上权限(permission >= 2)才能操作
/// - 不能提升到自己平级或更高权限
pub async fn increase_user_permission(
    Path(id): Path<i64>,
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    handle_service_result!(
        UserService::increase_user_permission(state, id, claims.sub, claims.user.permission).await,
        "提升用户权限成功"
    )
}

/// 降低用户权限
///
/// 权限控制：
/// - 需要Master及以上权限(permission >= 2)才能操作
/// - 不能降低权限大于等于自己的用户
pub async fn decrease_user_permission(
    Path(id): Path<i64>,
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    handle_service_result!(
        UserService::decrease_user_permission(state, id, claims.sub, claims.user.permission).await,
        "降低用户权限成功"
    )
}
