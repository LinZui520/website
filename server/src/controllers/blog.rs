use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::blog::{BlogDTO, BlogVO};
use crate::models::response::Response;
use crate::models::user::Permission;
use crate::services::blog::BlogService;
use axum::Json;
use axum::extract::{Path, State};
use axum::http::HeaderMap;
use std::sync::Arc;

/// 创建博客处理函数
///
/// 接受JSON格式的博客数据，创建新的博客记录及其标签关联
/// 需要Admin及以上权限才能创建博客
///
/// 请求体：
/// - title: 博客标题（必需）
/// - content: 博客内容（可选）
/// - publish: 是否发布（可选，默认false）
/// - tag_ids: 标签ID数组（可选）
pub async fn create_blog(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Json(blog_dto): Json<BlogDTO>,
) -> Response<String> {
    // 权限验证：需要Admin及以上权限才能创建博客
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层创建博客
    handle_service_result!(
        BlogService::create_blog(state, claims.sub, blog_dto).await,
        "博客创建成功"
    )
}

/// 查询所有博客列表处理函数
///
/// 查询所有博客信息，按创建时间倒序排列
/// 返回 BlogVO 列表，包含博客详细信息、作者信息和标签信息
/// 权限过滤：只显示权限低于当前用户的博客作者创建的博客，或者自己创建的博客
pub async fn read_blog(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
) -> Response<Vec<BlogVO>> {
    // 权限验证：需要Admin及以上权限才能查询博客
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层查询博客列表，传递当前用户的ID和权限进行过滤
    handle_service_result!(
        BlogService::read_blog(state, claims.sub, claims.user.permission).await,
        "博客查询成功"
    )
}

/// 查询所有已发布博客列表处理函数
///
/// 查询所有已发布的博客信息（publish = true），按创建时间倒序排列
/// 返回 BlogVO 列表，包含博客详细信息、作者信息和标签信息
/// 这是公开接口，不需要权限验证
pub async fn read_published_blog(State(state): State<Arc<AppState>>) -> Response<Vec<BlogVO>> {
    // 调用服务层查询已发布的博客列表
    handle_service_result!(
        BlogService::read_published_blog(state).await,
        "已发布博客查询成功"
    )
}

/// 根据 blog_id 查询单个博客处理函数
///
/// 根据路径参数中的 blog_id 查询单个博客信息
/// 返回 BlogVO，包含博客详细信息、作者信息和标签信息
/// 对于已发布的博客，这是公开接口；对于未发布的博客，需要权限验证
///
/// 路径参数：
/// - blog_id: 博客唯一标识符
pub async fn read_blog_by_id(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(blog_id): Path<String>,
) -> Response<BlogVO> {
    // 尝试提取权限信息（可选）
    let (current_user_id, current_user_permission) =
        match extract_permissions_from_headers(headers, Permission::User) {
            Some(claims) => (Some(claims.sub), Some(claims.user.permission)),
            None => (None, None), // 未登录用户或权限不足，仍可查看已发布的博客
        };

    // 调用服务层查询单个博客
    handle_service_result!(
        BlogService::read_blog_by_id(state, blog_id, current_user_id, current_user_permission)
            .await,
        "博客查询成功"
    )
}

/// 更新博客处理函数
///
/// 根据路径参数中的 blog_id 更新博客信息
/// 接受JSON格式的博客数据，更新博客记录及其标签关联
/// 需要Admin及以上权限，且只能更新权限低于自己的博客作者创建的博客，或者自己创建的博客
///
/// 路径参数：
/// - blog_id: 博客唯一标识符
///
/// 请求体：
/// - title: 博客标题（可选）
/// - content: 博客内容（可选）
/// - publish: 是否发布（可选）
/// - tag_ids: 标签ID数组（可选）
pub async fn update_blog(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(blog_id): Path<String>,
    Json(blog_dto): Json<BlogDTO>,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能更新博客
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层更新博客
    handle_service_result!(
        BlogService::update_blog(state, blog_id, claims.sub, claims.user.permission, blog_dto)
            .await,
        "博客更新成功"
    )
}

/// 删除博客处理函数
///
/// 根据路径参数中的 blog_id 删除博客记录及其标签关联
/// 需要Admin及以上权限，且只能删除权限低于自己的博客作者创建的博客，或者自己创建的博客
///
/// 路径参数：
/// - blog_id: 博客唯一标识符
pub async fn delete_blog(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(blog_id): Path<String>,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能删除博客
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层删除博客
    handle_service_result!(
        BlogService::delete_blog(state, blog_id, claims.sub, claims.user.permission).await,
        "博客删除成功"
    )
}
