use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::user::Permission;
use crate::models::{
    auth::AuthVO,
    response::Response,
    user::{UserDTO, UserVO},
};
use crate::services::auth::AuthService;
use axum::{
    Json,
    extract::{Multipart, State},
    http::HeaderMap,
};
use std::sync::Arc;

pub async fn verification_code(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UserDTO>,
) -> Response<()> {
    handle_service_result!(
        AuthService::verification_code(state, payload).await,
        "验证码发送成功"
    )
}

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UserDTO>,
) -> Response<()> {
    handle_service_result!(AuthService::register(state, payload).await, "注册成功")
}

pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UserDTO>,
) -> Response<AuthVO> {
    handle_service_result!(AuthService::login(state, payload).await, "登录成功")
}

pub async fn jwt_login(State(state): State<Arc<AppState>>, headers: HeaderMap) -> Response<AuthVO> {
    handle_service_result!(AuthService::jwt_login(state, headers).await, "登录成功")
}

pub async fn reset_password(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UserDTO>,
) -> Response<()> {
    handle_service_result!(
        AuthService::reset_password(state, payload).await,
        "密码重置成功"
    )
}

pub async fn upload_avatar(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    multipart: Multipart,
) -> Response<UserVO> {
    // 权限验证：需要User及以上权限（用户只能更新自己的头像）
    let claims = match extract_permissions_from_headers(headers, Permission::User) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    handle_service_result!(
        AuthService::upload_avatar(state, multipart, claims.sub).await,
        "头像更新成功"
    )
}

pub async fn update_username(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(payload): Json<UserDTO>,
) -> Response<UserVO> {
    // 权限验证：需要User及以上权限（用户只能更新自己的用户名）
    let claims = match extract_permissions_from_headers(headers, Permission::User) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    handle_service_result!(
        AuthService::update_username(state, payload, claims.sub).await,
        "用户名更新成功"
    )
}
