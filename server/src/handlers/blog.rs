use crate::core::jwt::extract_permissions_from_headers;
use crate::models::blog::{
    ActiveModel as BlogActiveModel, Blog, BlogDTO, BlogWithRelations, Column as BlogColumn,
    Entity as BlogEntity, Relation,
};
use crate::models::category::Column as CategoryColumn;
use crate::models::response::Response;
use crate::models::user::{Column as UserColumn, Entity as UserEntity, Permission};
use crate::{AppState, validate_field};
use axum::extract::Path;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, JoinType, QueryFilter, QueryOrder, QuerySelect,
    RelationTrait, Set, TransactionTrait,
};
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

    let postgres = &state.postgres;

    let title = validate_field!(form, "title", "标题");
    let category = match form.get("category").and_then(|v| v.as_i64()) {
        Some(category) => category,
        None => return Response::warn("分类字段缺失"),
    };
    let content = validate_field!(form, "content", "内容");
    let publish = form
        .get("publish")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    let blog = BlogActiveModel {
        author: Set(claims.sub),
        title: Set(title.to_string()),
        category: Set(category),
        content: Set(content.to_string()),
        publish: Set(publish),
        created_at: Set(Some(chrono::Utc::now())),
        updated_at: Set(Some(chrono::Utc::now())),
        updated_by: Set(claims.sub),
        ..Default::default()
    };

    Response::success(
        Blog::from(match blog.insert(postgres).await {
            Ok(blog) => blog,
            Err(err) => return Response::error(err),
        }),
        "创建博客成功",
    )
}

pub async fn delete_blog(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => return Response::error(err),
    };

    let (_, author) = match BlogEntity::find_by_id(id)
        .find_also_related(UserEntity)
        .one(&txn)
        .await
    {
        Ok(Some((blog, Some(author)))) => (blog, author),
        Ok(Some((_, None))) => return Response::warn("博客作者信息异常"),
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(err),
    };

    // 权限检查：管理员可以删除权限低于自己的博客
    if claims.user.permission < author.permission {
        return Response::warn("权限不足，无法删除该博客");
    }

    // 删除博客
    match BlogEntity::delete_by_id(id).exec(&txn).await {
        Ok(_) => {}
        Err(err) => return Response::error(err),
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(err);
    }

    Response::success((), "删除博客成功")
}

pub async fn update_blog(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    let title = validate_field!(form, "title", "标题");
    let category = match form.get("category").and_then(|v| v.as_i64()) {
        Some(category) => category,
        None => return Response::warn("分类字段缺失"),
    };
    let content = validate_field!(form, "content", "内容");
    let publish = form
        .get("publish")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => return Response::error(err),
    };

    let (blog, author) = match BlogEntity::find_by_id(id)
        .find_also_related(UserEntity)
        .one(&txn)
        .await
    {
        Ok(Some((blog, Some(author)))) => (blog, author),
        Ok(Some((_, None))) => return Response::warn("博客作者信息异常"),
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(err),
    };

    // 权限检查
    if claims.user.permission < author.permission {
        return Response::warn("权限不足，无法编辑该博客");
    }

    // 更新博客
    let mut blog_active: BlogActiveModel = blog.into();
    blog_active.title = Set(title.to_string());
    blog_active.category = Set(category);
    blog_active.content = Set(content.to_string());
    blog_active.publish = Set(publish);
    blog_active.updated_at = Set(Some(chrono::Utc::now()));
    blog_active.updated_by = Set(claims.sub);

    match blog_active.update(&txn).await {
        Ok(_) => {}
        Err(err) => return Response::error(err),
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(err);
    }

    Response::success((), "更新博客成功")
}

pub async fn list_published_blogs(
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<BlogDTO>> {
    let postgres = &state.postgres;

    let blogs = match BlogEntity::find()
        .filter(BlogColumn::Publish.eq(true))
        .join(JoinType::InnerJoin, Relation::Author.def())
        .join(JoinType::InnerJoin, Relation::Category.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission")
        .column_as(CategoryColumn::Id, "category_id")
        .column_as(CategoryColumn::Name, "category_name")
        .column_as(CategoryColumn::Description, "category_description")
        .column_as(CategoryColumn::CreatedAt, "category_created_at")
        .order_by_desc(BlogColumn::CreatedAt)
        .into_model::<BlogWithRelations>()
        .all(postgres)
        .await
    {
        Ok(data) => data.into_iter().map(|item| item.into_blog_dto()).collect(),
        Err(err) => return Response::error(err),
    };

    Response::success(blogs, "查询成功")
}

pub async fn get_blog(
    Path(id): Path<i64>,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<BlogDTO> {
    let postgres = &state.postgres;

    let blog = match BlogEntity::find_by_id(id)
        .filter(BlogColumn::Publish.eq(true))
        .join(JoinType::InnerJoin, Relation::Author.def())
        .join(JoinType::InnerJoin, Relation::Category.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission")
        .column_as(CategoryColumn::Id, "category_id")
        .column_as(CategoryColumn::Name, "category_name")
        .column_as(CategoryColumn::Description, "category_description")
        .column_as(CategoryColumn::CreatedAt, "category_created_at")
        .into_model::<BlogWithRelations>()
        .one(postgres)
        .await
    {
        Ok(Some(blog)) => blog.into_blog_dto(),
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(err),
    };

    Response::success(blog, "查询成功")
}
