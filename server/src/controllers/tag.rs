use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::response::Response;
use crate::models::tag::{TagDTO, TagVO};
use crate::models::user::Permission;
use crate::services::tag::TagService;
use axum::Json;
use axum::extract::{Path, State};
use axum::http::HeaderMap;
use std::sync::Arc;

/// 创建标签处理函数
///
/// 接受JSON格式的标签数据，创建新的标签记录
/// 需要Admin及以上权限才能创建标签
///
/// 请求体：
/// - tag_name: 标签名称（必需）
pub async fn create_tag(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Json(tag_dto): Json<TagDTO>,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能创建标签
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层创建标签
    handle_service_result!(
        TagService::create_tag(state, claims.sub, tag_dto).await,
        "标签创建成功"
    )
}

/// 查询所有标签列表处理函数
///
/// 查询所有标签信息，按创建时间倒序排列
/// 返回 TagVO 列表，包含标签ID和标签名称
pub async fn read_tag(State(state): State<Arc<AppState>>) -> Response<Vec<TagVO>> {
    // 调用服务层查询标签列表
    handle_service_result!(TagService::read_tag(state).await, "标签查询成功")
}

/// 根据 tag_id 查询单个标签处理函数
///
/// 根据路径参数中的 tag_id 查询单个标签信息
/// 返回 TagVO，包含标签ID和标签名称
///
/// 路径参数：
/// - tag_id: 标签唯一标识符
pub async fn read_tag_by_id(
    State(state): State<Arc<AppState>>,
    Path(tag_id): Path<String>,
) -> Response<TagVO> {
    // 调用服务层查询单个标签
    handle_service_result!(
        TagService::read_tag_by_id(state, tag_id).await,
        "标签查询成功"
    )
}

/// 更新标签处理函数
///
/// 根据 tag_id 更新标签信息
/// 只有标签创建者本人或管理员以上权限才能更新标签
///
/// 路径参数：
/// - tag_id: 标签唯一标识符
///
/// 请求体：
/// - tag_name: 新的标签名称（必需）
pub async fn update_tag(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(tag_id): Path<String>,
    Json(tag_dto): Json<TagDTO>,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能更新标签
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层更新标签
    handle_service_result!(
        TagService::update_tag(state, tag_id, claims.sub, claims.user.permission, tag_dto).await,
        "标签更新成功"
    )
}

/// 删除标签处理函数
///
/// 根据 tag_id 删除标签记录
/// 只有标签创建者本人或管理员及以上权限才能删除标签
///
/// 路径参数：
/// - tag_id: 标签唯一标识符
pub async fn delete_tag(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(tag_id): Path<String>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层删除标签
    handle_service_result!(
        TagService::delete_tag(state, tag_id, claims.sub, claims.user.permission).await,
        "标签删除成功"
    )
}
