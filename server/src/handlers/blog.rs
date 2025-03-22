use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::models::response::Response;
use crate::models::user::Permission;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use serde_json::Value;
use std::sync::Arc;

pub async fn create_blog(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let mut postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let title = match form.get("title").and_then(|v| v.as_str()) {
        Some(title) => title,
        None => return Response::warn("标题字段缺失"),
    };
    let category = match form.get("category").and_then(|v| v.as_i64()) {
        Some(category) => category,
        None => return Response::warn("标签字段缺失"),
    };
    let content = match form.get("content").and_then(|v| v.as_str()) {
        Some(content) => content,
        None => return Response::warn("内容字段缺失"),
    };

    let transaction = match postgres.transaction().await {
        Ok(transaction) => transaction,
        Err(err) => return Response::error("Postgres 开启事务失败", err),
    };

    match transaction
        .query_opt(
            "SELECT id FROM categories WHERE id = $1 LIMIT 1",
            &[&category],
        )
        .await
    {
        Ok(Some(_)) => {}
        Ok(None) => return Response::warn("标签不存在"),
        Err(err) => return Response::error("验证标签失败", err),
    };

    match transaction.execute(
        "INSERT INTO blogs (author, title, category, content, updated_by) VALUES ($1, $2, $3, $4, $5)",
        &[&claims.sub, &title, &category, &content, &claims.sub],
    ).await {
        Ok(_) => {},
        Err(err) => {
            if err.to_string().contains("unique constraint") && err.to_string().contains("title") {
                return Response::warn("博客已被添加");
            }
            return Response::error("添加博客失败", err)
        }
    };
    match transaction.commit().await {
        Ok(_) => Response::success((), "添加博客成功"),
        Err(err) => Response::error("Postgres 事务提交失败", err),
    }
}
