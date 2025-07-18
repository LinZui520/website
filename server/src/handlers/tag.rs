use crate::core::jwt::extract_permissions_from_headers;
use crate::models::response::Response;
use crate::models::tag::{ActiveModel as TagActiveModel, Entity as TagEntity, Tag};
use crate::models::user::Permission;
use crate::{AppState, validate_field};
use axum::extract::Path;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use sea_orm::{ActiveModelTrait, EntityTrait, Set};
use serde_json::Value;
use std::sync::Arc;

/// 创建标签
pub async fn create_tag(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<Tag> {
    let _claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    let name = validate_field!(form, "name", "标签名称");

    let tag = TagActiveModel {
        name: Set(name.to_string()),
        created_at: Set(Some(chrono::Utc::now())),
        ..Default::default()
    };

    Response::success(
        Tag::from(match tag.insert(postgres).await {
            Ok(tag) => tag,
            Err(err) => return Response::error(format!("创建标签失败: {err}")),
        }),
        "创建标签成功",
    )
}

/// 获取所有标签
pub async fn list_tags(Extension(state): Extension<Arc<AppState>>) -> Response<Vec<Tag>> {
    let postgres = &state.postgres;

    match TagEntity::find().all(postgres).await {
        Ok(tags) => Response::success(tags.into_iter().map(Tag::from).collect(), "查询标签成功"),
        Err(err) => Response::error(format!("查询标签失败: {err}")),
    }
}

/// 获取单个标签
pub async fn get_tag(
    Path(id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Tag> {
    let postgres = &state.postgres;

    match TagEntity::find_by_id(id).one(postgres).await {
        Ok(Some(tag)) => Response::success(Tag::from(tag), "查询标签成功"),
        Ok(None) => Response::warn("标签不存在"),
        Err(err) => Response::error(format!("查询标签失败: {err}")),
    }
}

/// 更新标签
pub async fn update_tag(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let _claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    let name = validate_field!(form, "name", "标签名称");

    let tag = match TagEntity::find_by_id(id).one(postgres).await {
        Ok(Some(tag)) => tag,
        Ok(None) => return Response::warn("标签不存在"),
        Err(err) => return Response::error(format!("查询标签失败: {err}")),
    };

    let mut tag_active: TagActiveModel = tag.into();
    tag_active.name = Set(name.to_string());

    match tag_active.update(postgres).await {
        Ok(_) => Response::success((), "更新标签成功"),
        Err(err) => Response::error(format!("更新标签失败: {err}")),
    }
}

/// 删除标签
pub async fn delete_tag(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<()> {
    let _claims = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    match TagEntity::delete_by_id(id).exec(postgres).await {
        Ok(delete_result) => {
            if delete_result.rows_affected > 0 {
                Response::success((), "删除标签成功")
            } else {
                Response::warn("标签不存在")
            }
        }
        Err(err) => Response::error(format!("删除标签失败: {err}")),
    }
}
