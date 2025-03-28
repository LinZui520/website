use crate::AppState;
use crate::core::jwt::extract_permissions_from_headers;
use crate::models::blog::{Blog, BlogDTO};
use crate::models::category::Category;
use crate::models::response::Response;
use crate::models::user::{Permission, User};
use axum::extract::Path;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use chrono::{DateTime, Utc};
use deadpool_postgres::GenericClient;
use serde_json::Value;
use std::sync::Arc;

pub async fn create_blog(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<Blog> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let mut postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let title = match form.get("title").and_then(|v| v.as_str()) {
        Some(title) if !title.is_empty() => title,
        Some(_) => return Response::warn("标题字段不能为空"),
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
    let publish = form
        .get("publish")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

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
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    let row = match transaction.query_one(
        "INSERT INTO blogs (author, title, category, content, publish, updated_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at",
        &[&claims.sub, &title, &category, &content, &publish, &claims.sub],
    ).await {
        Ok(row) => row,
        Err(err) => {
            if err.to_string().contains("unique constraint") && err.to_string().contains("title") {
                return Response::warn("博客已被添加");
            }
            return Response::error(err.to_string().as_str(), err)
        }
    };
    match transaction.commit().await {
        Ok(_) => Response::success(
            Blog {
                id: row.get::<&str, i64>("id"),
                author: claims.sub,
                title: title.to_string(),
                category,
                content: content.to_string(),
                publish,
                created_at: row.get::<&str, DateTime<Utc>>("created_at"),
                updated_at: row.get::<&str, DateTime<Utc>>("updated_at"),
                updated_by: claims.sub,
            },
            "添加博客成功",
        ),
        Err(err) => Response::error("Postgres 事务提交失败", err),
    }
}

pub async fn delete_blog(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Path(id): Path<i64>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let mut postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let transaction = match postgres.transaction().await {
        Ok(transaction) => transaction,
        Err(err) => return Response::error("Postgres 开启事务失败", err),
    };

    let row = match transaction
        .query_opt(
            "SELECT blogs.id, users.permission FROM blogs INNER JOIN users ON blogs.author = users.id WHERE blogs.id = $1 LIMIT 1",
            &[&id],
        )
        .await
    {
        Ok(Some(row)) => row,
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    let permission = row.get::<&str, i32>("permission");

    if claims.user.permission < permission {
        return Response::warn("权限不足");
    };

    let rows = match transaction
        .execute("DELETE FROM blogs WHERE id = $1", &[&id])
        .await
    {
        Ok(rows) => rows,
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };
    if rows != 1 {
        return Response::warn("博客不存在");
    };
    match transaction.commit().await {
        Ok(_) => Response::success((), "删除博客成功"),
        Err(err) => Response::error("Postgres 事务提交失败", err),
    }
}

pub async fn update_blog(
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

    let id = match form.get("id").and_then(|v| v.as_i64()) {
        Some(id) => id,
        None => return Response::warn("id字段缺失"),
    };
    let title = match form.get("title").and_then(|v| v.as_str()) {
        Some(title) if !title.is_empty() => title,
        Some(_) => return Response::warn("标题字段不能为空"),
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
    let publish = form
        .get("publish")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    let transaction = match postgres.transaction().await {
        Ok(transaction) => transaction,
        Err(err) => return Response::error("Postgres 开启事务失败", err),
    };

    let row = match transaction
        .query_opt(
            "SELECT blogs.id, users.permission FROM blogs INNER JOIN users ON blogs.author = users.id WHERE blogs.id = $1 LIMIT 1",
            &[&id],
        )
        .await
    {
        Ok(Some(row)) => row,
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    let permission = row.get::<&str, i32>("permission");

    if claims.user.permission < permission {
        return Response::warn("权限不足");
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
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    match transaction.execute(
        "UPDATE blogs SET title = $2, category = $3, content = $4, publish = $5, updated_at = $6, updated_by = $7  WHERE id = $1",
        &[&id, &title, &category, &content, &publish, &Utc::now(), &claims.sub],
    ).await {
        Ok(_) => {}
        Err(err) => return Response::error(err.to_string().as_str(), err),
    }

    match transaction.commit().await {
        Ok(_) => Response::success((), "保存博客成功"),
        Err(err) => Response::error("Postgres 事务提交失败", err),
    }
}

pub async fn list_blog(Extension(state): Extension<Arc<AppState>>) -> Response<Vec<BlogDTO>> {
    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let rows = match postgres
        .query(
            "SELECT blogs.id AS blog_id, blogs.author, users.avatar, users.username, users.email, users.permission, \
                blogs.title, blogs.category, categories.name AS category_name, categories.description AS category_description, categories.created_at AS category_created_at, \
                blogs.content, blogs.publish, blogs.created_at AS blog_created_at, blogs.updated_at, blogs.updated_by FROM blogs \
                INNER JOIN categories ON blogs.category = categories.id \
                INNER JOIN users ON blogs.author = users.id WHERE blogs.publish = TRUE",
            &[],
        )
        .await
    {
        Ok(rows) => rows,
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    let mut blogs: Vec<BlogDTO> = Vec::with_capacity(rows.len());
    for row in rows {
        let blog = BlogDTO {
            id: row.get::<&str, i64>("blog_id"),
            author: User {
                id: row.get::<&str, i64>("author"),
                avatar: row.get::<&str, &str>("avatar").to_owned(),
                username: row.get::<&str, &str>("username").to_owned(),
                email: row.get::<&str, &str>("email").to_owned(),
                permission: row.get::<&str, i32>("permission"),
            },
            title: row.get::<&str, &str>("title").to_owned(),
            category: Category {
                id: row.get::<&str, i64>("category"),
                name: row.get::<&str, &str>("category_name").to_owned(),
                description: row.get::<&str, &str>("category_description").to_owned(),
                created_at: row.get::<&str, DateTime<Utc>>("category_created_at"),
            },
            content: row.get::<&str, &str>("content").to_owned(),
            publish: row.get::<&str, bool>("publish"),
            created_at: row.get::<&str, DateTime<Utc>>("blog_created_at"),
            updated_at: row.get::<&str, DateTime<Utc>>("updated_at"),
            updated_by: row.get::<&str, i64>("updated_by"),
        };
        blogs.push(blog);
    }

    Response::success(blogs, "查询成功")
}

pub async fn get_blog(
    Extension(state): Extension<Arc<AppState>>,
    Path(id): Path<i64>,
) -> Response<BlogDTO> {
    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let row = match postgres
        .query_one(
            "SELECT blogs.id AS blog_id, blogs.author, users.avatar, users.username, users.email, users.permission, \
                blogs.title, blogs.category, categories.name AS category_name, categories.description AS category_description, categories.created_at AS category_created_at, \
                blogs.content, blogs.publish, blogs.created_at AS blog_created_at, blogs.updated_at, blogs.updated_by FROM blogs \
                INNER JOIN categories ON blogs.category = categories.id \
                INNER JOIN users ON blogs.author = users.id WHERE blogs.id = $1",
            &[&id],
        )
        .await
    {
        Ok(row) => row,
        Err(err) => return Response::error(err.to_string().as_str(), err),
    };

    let blog = BlogDTO {
        id: row.get::<&str, i64>("blog_id"),
        author: User {
            id: row.get::<&str, i64>("author"),
            avatar: row.get::<&str, &str>("avatar").to_owned(),
            username: row.get::<&str, &str>("username").to_owned(),
            email: row.get::<&str, &str>("email").to_owned(),
            permission: row.get::<&str, i32>("permission"),
        },
        title: row.get::<&str, &str>("title").to_owned(),
        category: Category {
            id: row.get::<&str, i64>("category"),
            name: row.get::<&str, &str>("category_name").to_owned(),
            description: row.get::<&str, &str>("category_description").to_owned(),
            created_at: row.get::<&str, DateTime<Utc>>("category_created_at"),
        },
        content: row.get::<&str, &str>("content").to_owned(),
        publish: row.get::<&str, bool>("publish"),
        created_at: row.get::<&str, DateTime<Utc>>("blog_created_at"),
        updated_at: row.get::<&str, DateTime<Utc>>("updated_at"),
        updated_by: row.get::<&str, i64>("updated_by"),
    };

    Response::success(blog, "查询成功")
}
