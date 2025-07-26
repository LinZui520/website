use crate::core::redis::{clear_cache, get_cache, set_cache};
use crate::models::tag::{ActiveModel, TagDTO, TagVO};
use crate::services::blog::BlogService;
use crate::{AppState, validate_option_field};
use anyhow::{Result, anyhow};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, Set,
    TransactionTrait,
};
use std::sync::Arc;
use uuid::Uuid;

pub struct TagService;

impl TagService {
    /// 标签列表缓存键
    const CACHE_KEY_LIST: &'static str = "tags:list";

    /// 标签列表缓存过期时间（秒）- 无限缓存，依赖主动清除
    const CACHE_EXPIRE_LIST: Option<u64> = None;

    /// 创建标签服务 - 创建新的标签记录
    pub async fn create_tag(state: Arc<AppState>, user_id: i64, tag_dto: TagDTO) -> Result<()> {
        let postgres = &state.postgres;

        let tag_name = validate_option_field!(tag_dto.tag_name, "标签名称");

        // 生成唯一标签ID
        let tag_id = format!("tag-{}", Uuid::new_v4());
        let now = chrono::Utc::now();

        // 创建标签记录
        let tag_active = ActiveModel {
            tag_id: Set(tag_id.clone()),
            tag_name: Set(tag_name.clone()),
            created_at: Set(now),
            created_by: Set(user_id),
            updated_at: Set(now),
            updated_by: Set(user_id),
            ..Default::default()
        };

        tag_active.insert(postgres).await?;

        // 异步清除标签列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }

    /// 查询所有标签列表 - 按创建时间倒序排列
    pub async fn read_tag(state: Arc<AppState>) -> Result<Vec<TagVO>> {
        // 尝试从缓存获取
        if let Some(tags) = get_cache::<Vec<TagVO>>(state.clone(), Self::CACHE_KEY_LIST).await? {
            return Ok(tags);
        }

        let postgres = &state.postgres;

        // 缓存未命中，从数据库查询
        let tags = crate::models::tag::Entity::find()
            .order_by_desc(crate::models::tag::Column::CreatedAt)
            .all(postgres)
            .await?
            .into_iter()
            .map(|tag| tag.into())
            .collect::<Vec<TagVO>>();

        // 异步设置缓存，不阻塞主函数
        let tags_for_cache = tags.clone();
        tokio::spawn(async move {
            set_cache(
                state,
                Self::CACHE_KEY_LIST,
                &tags_for_cache,
                Self::CACHE_EXPIRE_LIST,
            )
            .await
        });

        Ok(tags)
    }

    /// 根据 tag_id 查询单个标签
    pub async fn read_tag_by_id(state: Arc<AppState>, tag_id: String) -> Result<TagVO> {
        let postgres = &state.postgres;

        // 根据 tag_id 查询标签
        let tag = match crate::models::tag::Entity::find()
            .filter(crate::models::tag::Column::TagId.eq(tag_id.clone()))
            .one(postgres)
            .await?
        {
            Some(tag) => tag,
            None => return Err(anyhow!("WARN:标签不存在: {}", tag_id)),
        };

        Ok(tag.into())
    }

    /// 更新标签服务 - 根据 tag_id 更新标签信息
    pub async fn update_tag(
        state: Arc<AppState>,
        tag_id: String,
        user_id: i64,
        user_permission: i16,
        tag_dto: TagDTO,
    ) -> Result<()> {
        let postgres = &state.postgres;

        let tag_name = validate_option_field!(tag_dto.tag_name, "标签名称");

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询标签是否存在，同时联表查询创建者的权限信息
        let (tag, user) = match crate::models::tag::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::tag::Column::TagId.eq(tag_id.clone()))
            .one(&txn)
            .await?
        {
            Some((tag, Some(user))) => (tag, user),
            Some((_, None)) => return Err(anyhow!("WARN:标签创建者不存在: {}", tag_id)),
            None => return Err(anyhow!("WARN:标签不存在: {}", tag_id)),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if tag.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!("WARN:权限不足"));
        }

        // 更新标签记录
        let mut tag_active: ActiveModel = tag.into();
        tag_active.tag_name = Set(tag_name);
        tag_active.updated_at = Set(chrono::Utc::now());
        tag_active.updated_by = Set(user_id);

        tag_active.update(&txn).await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除相关缓存，不阻塞主函数
        tokio::spawn(async move {
            // 清除标签列表缓存
            let _ = clear_cache(state.clone(), Self::CACHE_KEY_LIST).await;
            // 清除博客列表缓存，因为博客中包含标签信息
            let _ = clear_cache(state.clone(), BlogService::CACHE_KEY_PUBLISHED_LIST).await;
        });

        Ok(())
    }

    /// 删除标签服务 - 根据 tag_id 删除标签记录
    pub async fn delete_tag(
        state: Arc<AppState>,
        tag_id: String,
        user_id: i64,
        user_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询标签是否存在，同时联表查询创建者的权限信息
        let (tag, user) = match crate::models::tag::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::tag::Column::TagId.eq(tag_id.clone()))
            .one(&txn)
            .await?
        {
            Some((tag, Some(user))) => (tag, user),
            Some((_, None)) => return Err(anyhow!("WARN:标签创建者不存在: {}", tag_id)),
            None => return Err(anyhow!("WARN:标签不存在: {}", tag_id)),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if tag.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!("WARN:权限不足"));
        }

        // 检查是否有博客使用了这个标签
        let blog_tag_count = crate::models::blog_tag::Entity::find()
            .filter(crate::models::blog_tag::Column::TagId.eq(tag_id.clone()))
            .count(&txn)
            .await?;

        if blog_tag_count > 0 {
            return Err(anyhow!(
                "WARN:该标签正在被 {blog_tag_count} 篇博客使用，无法删除"
            ));
        }

        // 删除数据库记录
        crate::models::tag::Entity::delete_by_id(tag.id)
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除标签列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }
}
