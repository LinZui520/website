use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::handle_service_result;
use crate::models::board::{BoardDTO, BoardVO};
use crate::models::response::Response;
use crate::models::user::Permission;
use crate::services::board::BoardService;
use axum::Json;
use axum::extract::{Path, State};
use axum::http::HeaderMap;
use std::sync::Arc;

/// 创建留言板处理函数
///
/// 接受JSON格式的留言板数据，在数据库中创建留言板记录
/// 包括名称和描述信息
///
/// 请求体：
/// - name: 留言板名称（必需）
/// - description: 留言板描述（可选）
pub async fn create_board(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Json(board_dto): Json<BoardDTO>,
) -> Response<()> {
    // 权限验证：需要Master及以上权限才能创建留言板
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层处理留言板创建
    handle_service_result!(
        BoardService::create_board(state, claims.sub, board_dto).await,
        "留言板创建成功"
    )
}

pub async fn read_board(State(state): State<Arc<AppState>>) -> Response<Vec<BoardVO>> {
    // 调用服务层查询留言板详情
    handle_service_result!(BoardService::read_board(state).await, "留言板查询成功")
}

/// 根据 board_id 查询单个留言板处理函数
///
/// 根据路径参数中的 board_id 查询指定留言板的详细信息
/// 这是公开接口，不需要权限验证
///
/// 路径参数：
/// - board_id: 留言板唯一标识符
pub async fn read_board_by_id(
    State(state): State<Arc<AppState>>,
    Path(board_id): Path<String>,
) -> Response<BoardVO> {
    // 调用服务层查询指定留言板详情
    handle_service_result!(
        BoardService::read_board_by_id(state, board_id).await,
        "留言板查询成功"
    )
}

/// 更新留言板处理函数
///
/// 根据路径参数中的 board_id 更新留言板信息
/// 接受JSON格式的留言板数据，更新留言板的名称和描述信息
/// 需要Master及以上权限，且只能更新权限低于自己的留言板作者创建的留言板，或者自己创建的留言板
///
/// 路径参数：
/// - board_id: 留言板唯一标识符
///
/// 请求体：
/// - name: 留言板名称（必需）
/// - description: 留言板描述（可选）
pub async fn update_board(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(board_id): Path<String>,
    Json(board_dto): Json<BoardDTO>,
) -> Response<()> {
    // 权限验证：需要Master及以上权限才能更新留言板
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层更新留言板
    handle_service_result!(
        BoardService::update_board(
            state,
            board_id,
            claims.sub,
            claims.user.permission,
            board_dto
        )
        .await,
        "留言板更新成功"
    )
}

/// 删除留言板处理函数
///
/// 根据 board_id 删除留言板记录
/// 只有留言板作者本人或管理员及以上权限才能删除留言板
///
/// 路径参数：
/// - board_id: 留言板唯一标识符
pub async fn delete_board(
    headers: HeaderMap,
    State(state): State<Arc<AppState>>,
    Path(board_id): Path<String>,
) -> Response<()> {
    // 权限验证：需要Master及以上权限才能删除留言板
    let claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    // 调用服务层删除留言板
    handle_service_result!(
        BoardService::delete_board(state, board_id, claims.sub, claims.user.permission).await,
        "留言板删除成功"
    )
}
