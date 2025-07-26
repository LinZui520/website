use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::picture::PictureVO;
use crate::models::response::Response;
use crate::models::user::Permission;
use crate::services::picture::PictureService;
use axum::extract::{Multipart, Path, State};
use axum::http::HeaderMap;
use std::sync::Arc;

/// 上传图片处理函数
///
/// 接受multipart/form-data格式的图片文件，保存到本地文件系统
/// 并在数据库中记录图片信息
///
/// 表单字段：
/// - picture: 图片文件（必需）
pub async fn create_picture(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    multipart: Multipart,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能上传图片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层处理文件上传
    handle_service_result!(
        PictureService::create_picture(state, claims.sub, multipart).await,
        "图片上传成功"
    )
}

pub async fn read_picture(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> Response<Vec<PictureVO>> {
    // 权限验证：需要User及以上权限才能查询图片
    let claims = match extract_permissions_from_headers(headers, Permission::User) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层查询图片详情
    handle_service_result!(
        PictureService::read_picture(state, claims.sub, claims.user.permission).await,
        "图片查询成功"
    )
}

/// 删除图片处理函数
///
/// 根据 picture_id 删除图片记录和文件
/// 只有图片作者本人或管理员及以上权限才能删除图片
///
/// 路径参数：
/// - picture_id: 图片唯一标识符
pub async fn delete_picture(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(picture_id): Path<String>,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能删除图片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层删除图片
    handle_service_result!(
        PictureService::delete_picture(state, picture_id, claims.sub, claims.user.permission).await,
        "图片删除成功"
    )
}
