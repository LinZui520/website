use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::photo::{PhotoDTO, PhotoVO};
use crate::models::response::Response;
use crate::models::user::Permission;
use crate::services::photo::PhotoService;
use axum::Json;
use axum::extract::{Multipart, Path, State};
use axum::http::HeaderMap;
use std::sync::Arc;

/// 上传照片处理函数
///
/// 接受multipart/form-data格式的照片文件，保存到本地文件系统
/// 并在数据库中记录照片信息，包括描述和位置信息
///
/// 表单字段：
/// - photo: 照片文件（必需）
/// - location: 拍摄地点（必需）
/// - description: 照片描述（可选）
pub async fn create_photo(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    multipart: Multipart,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能上传照片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层处理文件上传
    handle_service_result!(
        PhotoService::create_photo(state, claims.sub, multipart).await,
        "照片上传成功"
    )
}

pub async fn read_photo(State(state): State<Arc<AppState>>) -> Response<Vec<PhotoVO>> {
    // 调用服务层查询照片详情
    handle_service_result!(PhotoService::read_photo(state).await, "照片查询成功")
}

/// 更新照片处理函数
///
/// 根据路径参数中的 photo_id 更新照片信息
/// 接受JSON格式的照片数据，更新照片的描述信息
/// 需要Admin及以上权限，且只能更新权限低于自己的照片作者创建的照片，或者自己创建的照片
///
/// 路径参数：
/// - photo_id: 照片唯一标识符
///
/// 请求体：
/// - description: 照片描述（可选）
pub async fn update_photo(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(photo_id): Path<String>,
    Json(photo_dto): Json<PhotoDTO>,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能更新照片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层更新照片
    handle_service_result!(
        PhotoService::update_photo(
            state,
            photo_id,
            claims.sub,
            claims.user.permission,
            photo_dto
        )
        .await,
        "照片更新成功"
    )
}

/// 删除照片处理函数
///
/// 根据 photo_id 删除照片记录和文件
/// 只有照片作者本人或管理员及以上权限才能删除照片
///
/// 路径参数：
/// - photo_id: 照片唯一标识符
pub async fn delete_photo(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(photo_id): Path<String>,
) -> Response<()> {
    // 权限验证：需要User及以上权限才能删除照片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层删除照片
    handle_service_result!(
        PhotoService::delete_photo(state, photo_id, claims.sub, claims.user.permission).await,
        "照片删除成功"
    )
}
