use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::models::category::Category;
use crate::models::response::Response;
use crate::models::user::Permission;
use axum::extract::Path;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use chrono::{DateTime, Utc};
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

    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let name = match form.get("name").and_then(|v| v.as_str()) {
        Some(name) if !name.is_empty() => name,
        Some(_) => return Response::warn("名称不能为空"),
        None => return Response::warn("名称字段缺失"),
    };
    let description = match form.get("description").and_then(|v| v.as_str()) {
        Some(description) if !description.is_empty() => description,
        Some(_) => return Response::warn("描述不能为空"),
        None => return Response::warn("描述字段缺失"),
    };

    match postgres
        .execute(
            "INSERT INTO categories (name, description) VALUES ($1, $2)",
            &[&name, &description],
        )
        .await
    {
        Ok(_) => Response::success((), "添加成功"),
        Err(err) => {
            if err.to_string().contains("unique constraint") && err.to_string().contains("name") {
                return Response::warn("标签已被添加");
            }
            Response::error(err.to_string().as_str(), err)
        }
    }
}

pub async fn delete_category(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(id): Path<i64>,
) -> Response<()> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let rows = match postgres
        .execute("DELETE FROM categories WHERE id = $1", &[&id])
        .await
    {
        Ok(rows) => rows,
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };
    if rows != 1 {
        return Response::warn("标签不存在");
    };
    Response::success((), "删除成功")
}

pub async fn update_category(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let _ = match extract_permissions_from_headers(headers, Permission::Master) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let id = match form.get("id").and_then(|v| v.as_i64()) {
        Some(id) => id,
        None => return Response::warn("id字段缺失"),
    };
    let name = match form.get("name").and_then(|v| v.as_str()) {
        Some(name) if !name.is_empty() => name,
        Some(_) => return Response::warn("名称不能为空"),
        None => return Response::warn("名称字段缺失"),
    };
    let description = match form.get("description").and_then(|v| v.as_str()) {
        Some(description) if !description.is_empty() => description,
        Some(_) => return Response::warn("描述不能为空"),
        None => return Response::warn("描述字段缺失"),
    };

    let rows = match postgres
        .execute(
            "UPDATE categories SET name = $2, description = $3 WHERE id = $1",
            &[&id, &name, &description],
        )
        .await
    {
        Ok(rows) => rows,
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };
    if rows != 1 {
        return Response::warn("标签不存在");
    }
    Response::success((), "修改标签成功")
}

pub async fn list_categories(
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<Category>> {
    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let rows = match postgres
        .query(
            "SELECT id, name, description, created_at FROM categories",
            &[],
        )
        .await
    {
        Ok(row) => row,
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    let mut categories = Vec::with_capacity(rows.len());
    for row in rows {
        let category = Category {
            id: row.get::<&str, i64>("id"),
            name: row.get::<&str, &str>("name").to_owned(),
            description: Some(row.get::<&str, &str>("description").to_owned()),
            created_at: row.get::<&str, DateTime<Utc>>("created_at"),
        };
        categories.push(category);
    }
    Response::success(categories, "查询成功")
}
