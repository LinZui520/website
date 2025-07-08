use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::models::response::Response;
use crate::models::user::{ActiveModel, Entity as UserEntity, Permission, User};
use axum::Extension;
use axum::extract::Path;
use axum::http::HeaderMap;
use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set};
use std::sync::Arc;

/// 获取用户列表
///
/// 权限控制：
/// - 需要Master及以上权限(permission >= 2)才能查看所有用户
pub async fn list_users(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<User>> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 查询所有用户，按创建时间倒序排列
    match UserEntity::find()
        .order_by_desc(crate::models::user::Column::CreatedAt)
        .all(postgres)
        .await
    {
        Ok(users) => Response::success(
            users.into_iter().map(|user| user.into()).collect(),
            "查询用户列表成功",
        ),
        Err(err) => Response::error(format!("查询用户列表失败: {err}")),
    }
}

/// 提升用户权限
///
/// 权限控制：
/// - 需要Master及以上权限(permission >= 2)才能操作
/// - 不能提升到自己平级或更高权限
pub async fn increase_user_permission(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    let target_user = match UserEntity::find_by_id(id).one(postgres).await {
        Ok(Some(user)) => user,
        Ok(None) => return Response::warn("用户不存在"),
        Err(err) => return Response::error(format!("查询用户失败: {err}")),
    };

    // 检查是否是操作自己
    if claims.sub == target_user.id {
        return Response::warn("不能修改自己的权限");
    }

    let new_permission = target_user.permission + 1;

    // 检查提升后的权限不能达到或超过操作者的权限
    if new_permission >= claims.user.permission {
        return Response::warn("不能提升用户权限到与自己平级或更高");
    }

    // 检查权限上限（不能超过Root权限）
    if new_permission > 3 {
        return Response::warn("用户权限已达到最高级别");
    }

    // 更新用户权限
    let user_active = ActiveModel {
        id: Set(target_user.id),
        permission: Set(new_permission),
        ..Default::default()
    };

    match user_active.update(postgres).await {
        Ok(_) => Response::success((), "提升用户权限成功"),
        Err(err) => Response::error(format!("更新用户权限失败: {err}")),
    }
}

/// 降低用户权限
///
/// 权限控制：
/// - 需要Master及以上权限(permission >= 2)才能操作
/// - 不能降低权限大于等于自己的用户
pub async fn decrease_user_permission(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<User> {
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 查询目标用户
    let target_user = match UserEntity::find_by_id(id).one(postgres).await {
        Ok(Some(user)) => user,
        Ok(None) => return Response::warn("用户不存在"),
        Err(err) => return Response::error(format!("查询用户失败: {err}")),
    };

    // 检查是否是操作自己
    if claims.sub == target_user.id {
        return Response::warn("不能修改自己的权限");
    }

    // 检查不能降低权限大于等于自己的用户
    if target_user.permission >= claims.user.permission {
        return Response::warn("不能降低权限大于等于自己的用户");
    }

    let new_permission = target_user.permission - 1;

    // 检查权限下限（不能低于Block权限）
    if new_permission < -1 {
        return Response::warn("用户权限已达到最低级别");
    }

    // 更新用户权限
    let user_active = ActiveModel {
        id: Set(target_user.id),
        permission: Set(new_permission),
        ..Default::default()
    };

    match user_active.update(postgres).await {
        Ok(updated_user) => Response::success(updated_user.into(), "降低用户权限成功"),
        Err(err) => Response::error(format!("更新用户权限失败: {err}")),
    }
}
