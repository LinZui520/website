use crate::core::jwt::extract_permissions_from_headers;
use crate::models::blog::{
    ActiveModel as BlogActiveModel, Blog, BlogDTO, BlogWithRelations, Column as BlogColumn,
    Entity as BlogEntity, Relation,
};
use crate::models::blog_tag::{ActiveModel as BlogTagActiveModel, Entity as BlogTagEntity};
use crate::models::response::Response;
use crate::models::tag::{Entity as TagEntity, Tag};
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
    let tag_ids = match form.get("tag_ids").and_then(|v| v.as_array()) {
        Some(arr) => {
            let mut ids = Vec::new();
            for item in arr {
                if let Some(id) = item.as_i64() {
                    ids.push(id);
                }
            }
            ids
        }
        None => Vec::new(), // 允许没有标签
    };
    let content = validate_field!(form, "content", "内容");
    let publish = form
        .get("publish")
        .and_then(|v| v.as_bool())
        .unwrap_or(false);

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => return Response::error(format!("开始事务失败: {err}")),
    };

    // 创建博客
    let blog = BlogActiveModel {
        author: Set(claims.sub),
        title: Set(title.to_string()),
        content: Set(content.to_string()),
        publish: Set(publish),
        created_at: Set(Some(chrono::Utc::now())),
        updated_at: Set(Some(chrono::Utc::now())),
        updated_by: Set(claims.sub),
        ..Default::default()
    };

    let created_blog = match blog.insert(&txn).await {
        Ok(blog) => blog,
        Err(err) => return Response::error(format!("创建博客失败: {err}")),
    };

    // 创建博客标签关联
    for tag_id in tag_ids {
        let blog_tag = BlogTagActiveModel {
            blog_id: Set(created_blog.id),
            tag_id: Set(tag_id),
        };

        if let Err(err) = blog_tag.insert(&txn).await {
            return Response::error(format!("创建博客标签关联失败: {err}"));
        }
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(format!("提交事务失败: {err}"));
    }

    Response::success(Blog::from(created_blog), "创建博客成功")
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
        Err(err) => return Response::error(format!("开始事务失败: {err}")),
    };

    let (_, author) = match BlogEntity::find_by_id(id)
        .find_also_related(UserEntity)
        .one(&txn)
        .await
    {
        Ok(Some((blog, Some(author)))) => (blog, author),
        Ok(Some((_, None))) => return Response::warn("博客作者信息异常"),
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(format!("查询博客失败: {err}")),
    };

    if claims.user.permission <= author.permission && claims.sub != author.id {
        return Response::warn("权限不足，无法删除该博客");
    }

    // 先删除博客标签关联
    match BlogTagEntity::delete_many()
        .filter(crate::models::blog_tag::Column::BlogId.eq(id))
        .exec(&txn)
        .await
    {
        Ok(_) => {}
        Err(err) => return Response::error(format!("删除博客标签关联失败: {err}")),
    }

    // 删除博客
    match BlogEntity::delete_by_id(id).exec(&txn).await {
        Ok(_) => {}
        Err(err) => return Response::error(format!("删除博客失败: {err}")),
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(format!("提交事务失败: {err}"));
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
    let tag_ids = match form.get("tag_ids").and_then(|v| v.as_array()) {
        Some(arr) => {
            let mut ids = Vec::new();
            for item in arr {
                if let Some(id) = item.as_i64() {
                    ids.push(id);
                }
            }
            ids
        }
        None => Vec::new(), // 允许没有标签
    };
    let content = validate_field!(form, "content", "内容");
    let publish = match form.get("publish").and_then(|v| v.as_bool()) {
        Some(publish) => publish,
        None => return Response::warn("发布字段缺失"),
    };

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => return Response::error(format!("开始事务失败: {err}")),
    };

    let (blog, author) = match BlogEntity::find_by_id(id)
        .find_also_related(UserEntity)
        .one(&txn)
        .await
    {
        Ok(Some((blog, Some(author)))) => (blog, author),
        Ok(Some((_, None))) => return Response::warn("博客作者信息异常"),
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(format!("查询博客失败: {err}")),
    };

    // 权限检查
    if claims.user.permission <= author.permission && claims.sub != author.id {
        return Response::warn("权限不足，无法编辑该博客");
    }

    // 更新博客
    let mut blog_active: BlogActiveModel = blog.into();
    blog_active.title = Set(title.to_string());
    blog_active.content = Set(content.to_string());
    blog_active.publish = Set(publish);
    blog_active.updated_at = Set(Some(chrono::Utc::now()));
    blog_active.updated_by = Set(claims.sub);

    match blog_active.update(&txn).await {
        Ok(_) => {}
        Err(err) => return Response::error(format!("更新博客失败: {err}")),
    }

    // 删除现有的标签关联
    match BlogTagEntity::delete_many()
        .filter(crate::models::blog_tag::Column::BlogId.eq(id))
        .exec(&txn)
        .await
    {
        Ok(_) => {}
        Err(err) => return Response::error(format!("删除原有标签关联失败: {err}")),
    }

    // 创建新的标签关联
    for tag_id in tag_ids {
        let blog_tag = BlogTagActiveModel {
            blog_id: Set(id),
            tag_id: Set(tag_id),
        };

        if let Err(err) = blog_tag.insert(&txn).await {
            return Response::error(format!("创建博客标签关联失败: {err}"));
        }
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(format!("提交事务失败: {err}"));
    }

    Response::success((), "更新博客成功")
}

pub async fn list_published_blogs(
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<BlogDTO>> {
    let postgres = &state.postgres;

    // 查询已发布的博客基本信息
    let blogs_data = match BlogEntity::find()
        .filter(BlogColumn::Publish.eq(true))
        .join(JoinType::InnerJoin, Relation::Author.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission")
        .order_by_desc(BlogColumn::CreatedAt)
        .into_model::<BlogWithRelations>()
        .all(postgres)
        .await
    {
        Ok(data) => data,
        Err(err) => return Response::error(format!("查询已发布博客失败: {err}")),
    };

    // 获取所有博客ID
    let blog_ids: Vec<i64> = blogs_data.iter().map(|blog| blog.id).collect();

    // 批量获取所有博客的标签
    let blogs_tags = match get_blogs_tags(&blog_ids, postgres).await {
        Ok(tags) => tags,
        Err(err) => return Response::error(format!("查询博客标签失败: {err}")),
    };

    // 组装BlogDTO
    let blog_dtos: Vec<BlogDTO> = blogs_data
        .into_iter()
        .map(|blog| {
            let tags = blogs_tags.get(&blog.id).cloned().unwrap_or_default();
            blog.into_blog_dto(tags)
        })
        .collect();

    Response::success(blog_dtos, "查询成功")
}

/// 获取博客的标签列表
async fn get_blog_tags(
    blog_id: i64,
    db: &sea_orm::DatabaseConnection,
) -> Result<Vec<Tag>, sea_orm::DbErr> {
    TagEntity::find()
        .join(
            JoinType::InnerJoin,
            crate::models::tag::Relation::BlogTags.def(),
        )
        .filter(crate::models::blog_tag::Column::BlogId.eq(blog_id))
        .all(db)
        .await
        .map(|tags| tags.into_iter().map(Tag::from).collect())
}

/// 获取多个博客的标签（批量查询优化）
async fn get_blogs_tags(
    blog_ids: &[i64],
    db: &sea_orm::DatabaseConnection,
) -> Result<std::collections::HashMap<i64, Vec<Tag>>, sea_orm::DbErr> {
    use std::collections::HashMap;

    // 查询所有相关的博客标签关联
    let blog_tags = BlogTagEntity::find()
        .filter(crate::models::blog_tag::Column::BlogId.is_in(blog_ids.iter().cloned()))
        .find_also_related(TagEntity)
        .all(db)
        .await?;

    // 组织成HashMap
    let mut result: HashMap<i64, Vec<Tag>> = HashMap::new();

    for (blog_tag, tag) in blog_tags {
        if let Some(tag) = tag {
            result
                .entry(blog_tag.blog_id)
                .or_default()
                .push(Tag::from(tag));
        }
    }

    Ok(result)
}

pub async fn get_blog(
    Path(id): Path<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<BlogDTO> {
    let postgres = &state.postgres;

    // 尝试提取权限信息（不强制要求）
    let claims = extract_permissions_from_headers(headers, Permission::Admin);

    // 构建基础查询
    let mut query = BlogEntity::find_by_id(id)
        .join(JoinType::InnerJoin, Relation::Author.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission");

    // 根据权限决定是否过滤 publish 字段
    match claims {
        Some(claims) if claims.user.permission > 1 => {}
        Some(claims) if claims.user.permission <= 1 => {
            // 权限 <= 1：只能查看自己的博客（不管是否发布）
            query = query.filter(BlogColumn::Author.eq(claims.sub));
        }
        Some(_) | None => {
            // 无权限：只能查看已发布的博客
            query = query.filter(BlogColumn::Publish.eq(true));
        }
    }

    // 执行查询
    let blog_data = match query.into_model::<BlogWithRelations>().one(postgres).await {
        Ok(Some(blog)) => blog,
        Ok(None) => return Response::warn("博客不存在"),
        Err(err) => return Response::error(format!("查询博客失败: {err}")),
    };

    // 获取博客的标签
    let tags = match get_blog_tags(id, postgres).await {
        Ok(tags) => tags,
        Err(err) => return Response::error(format!("查询博客标签失败: {err}")),
    };

    Response::success(blog_data.into_blog_dto(tags), "查询成功")
}

pub async fn list_blogs(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<BlogDTO>> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 构建基础查询
    let mut query = BlogEntity::find()
        .join(JoinType::InnerJoin, Relation::Author.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission")
        .order_by_desc(BlogColumn::CreatedAt);

    // 根据权限添加过滤条件
    if claims.user.permission == 1 {
        // Admin 权限：只显示自己的博客
        query = query.filter(BlogColumn::Author.eq(claims.sub));
    } else if claims.user.permission >= 2 {
        // Master+ 权限：显示所有博客
    }

    // 执行查询
    let blogs_data = match query.into_model::<BlogWithRelations>().all(postgres).await {
        Ok(data) => data,
        Err(err) => return Response::error(format!("查询博客列表失败: {err}")),
    };

    // 获取所有博客ID
    let blog_ids: Vec<i64> = blogs_data.iter().map(|blog| blog.id).collect();

    // 批量获取所有博客的标签
    let blogs_tags = match get_blogs_tags(&blog_ids, postgres).await {
        Ok(tags) => tags,
        Err(err) => return Response::error(format!("查询博客标签失败: {err}")),
    };

    // 组装BlogDTO
    let blog_dtos: Vec<BlogDTO> = blogs_data
        .into_iter()
        .map(|blog| {
            let tags = blogs_tags.get(&blog.id).cloned().unwrap_or_default();
            blog.into_blog_dto(tags)
        })
        .collect();

    Response::success(blog_dtos, "查询成功")
}
