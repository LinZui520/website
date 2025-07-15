use crate::core::jwt::extract_permissions_from_headers;
use crate::models::category::{
    ActiveModel as CategoryActiveModel, Category, Column as CategoryColumn,
    Entity as CategoryEntity,
};
use crate::models::response::Response;
use crate::models::user::Permission;
use crate::{AppState, validate_field};
use axum::extract::Path;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use chrono::Utc;
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use serde_json::Value;
use std::sync::Arc;

pub async fn create_category(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    let name = validate_field!(form, "name", "分类名称");
    let description = validate_field!(form, "description", "分类描述");

    let category = CategoryActiveModel {
        name: Set(name.to_string()),
        description: Set(description.to_string()),
        created_at: Set(Some(Utc::now())),
        ..Default::default()
    };

    match category.insert(postgres).await {
        Ok(_) => Response::success((), "分类创建成功"),
        Err(err) => Response::error(format!("创建分类失败: {err}")),
    }
}

pub async fn delete_category(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<()> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    match CategoryEntity::delete_by_id(id).exec(postgres).await {
        Ok(_) => Response::success((), "分类删除成功"),
        Err(err) => Response::error(format!("删除分类失败: {err}")),
    }
}

pub async fn update_category(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    let name = validate_field!(form, "name", "分类名称");
    let description = validate_field!(form, "description", "分类描述");

    match CategoryEntity::update_many()
        .filter(CategoryColumn::Id.eq(id))
        .col_expr(CategoryColumn::Name, Expr::value(name))
        .col_expr(CategoryColumn::Description, Expr::value(description))
        .exec(postgres)
        .await
    {
        Ok(_) => Response::success((), "分类更新成功"),
        Err(err) => Response::error(format!("更新分类失败: {err}")),
    }
}

pub async fn list_categories(
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<Category>> {
    let postgres = &state.postgres;

    match CategoryEntity::find().all(postgres).await {
        Ok(models) => {
            Response::success(models.into_iter().map(Category::from).collect(), "查询成功")
        }
        Err(err) => Response::error(format!("查询分类列表失败: {err}")),
    }
}

pub async fn get_category(
    Path(id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Category> {
    let postgres = &state.postgres;

    match CategoryEntity::find_by_id(id).one(postgres).await {
        Ok(Some(model)) => Response::success(Category::from(model), "查询成功"),
        Ok(None) => Response::warn("分类不存在"),
        Err(err) => Response::error(format!("查询分类失败: {err}")),
    }
}
