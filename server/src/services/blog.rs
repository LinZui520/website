use crate::core::redis::{clear_cache, get_cache, set_cache};
use crate::models::blog::{ActiveModel, BlogDTO, BlogVO, BlogWithUser};
use crate::models::blog_tag::ActiveModel as BlogTagActiveModel;
use crate::models::tag::TagVO;
use crate::{AppState, validate_option_field};
use anyhow::{Result, anyhow};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, JoinType, QueryFilter, QueryOrder, QuerySelect,
    RelationTrait, Set, TransactionTrait,
};
use std::collections::HashMap;
use std::sync::Arc;
use uuid::Uuid;

pub struct BlogService;

impl BlogService {
    /// 博客列表缓存键
    pub const CACHE_KEY_PUBLISHED_LIST: &'static str = "blogs:published_list";

    /// 博客列表缓存过期时间（秒）- 无限缓存，依赖主动清除
    const CACHE_EXPIRE_PUBLISHED_LIST: Option<u64> = None;

    /// 创建博客服务 - 创建新的博客记录及其标签关联
    pub async fn create_blog(
        state: Arc<AppState>,
        user_id: i64,
        blog_dto: BlogDTO,
    ) -> Result<String> {
        let postgres = &state.postgres;

        let title = validate_option_field!(blog_dto.title, "博客标题");
        let content = blog_dto.content;
        let publish = blog_dto.publish.unwrap_or(false);
        let tag_ids = blog_dto.tag_ids.unwrap_or_default();

        if tag_ids.is_empty() {
            return Err(anyhow!("WARN:标签不能为空"));
        }
        // 开始事务
        let txn = postgres.begin().await?;

        // 在事务内验证标签是否存在
        let existing_tags = crate::models::tag::Entity::find()
            .filter(crate::models::tag::Column::TagId.is_in(tag_ids.clone()))
            .all(&txn)
            .await?;

        if existing_tags.len() != tag_ids.len() {
            return Err(anyhow!("WARN:部分标签不存在"));
        }

        // 生成唯一博客ID
        let blog_id = format!("blog-{}", Uuid::new_v4());

        let now = chrono::Utc::now();

        // 创建博客记录
        let blog_active = ActiveModel {
            blog_id: Set(blog_id.clone()),
            title: Set(title),
            content: Set(content),
            publish: Set(publish),
            created_at: Set(now),
            created_by: Set(user_id),
            updated_at: Set(now),
            updated_by: Set(user_id),
            ..Default::default()
        };

        blog_active.insert(&txn).await?;

        // 批量创建博客标签关联记录
        let blog_tag_models: Vec<BlogTagActiveModel> = tag_ids
            .into_iter()
            .map(|tag_id| BlogTagActiveModel {
                blog_id: Set(blog_id.clone()),
                tag_id: Set(tag_id),
                created_at: Set(now),
                created_by: Set(user_id),
                updated_at: Set(now),
                updated_by: Set(user_id),
                ..Default::default()
            })
            .collect();

        crate::models::blog_tag::Entity::insert_many(blog_tag_models)
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除博客列表缓存，不阻塞主函数
        tokio::spawn(
            async move { clear_cache(state.clone(), Self::CACHE_KEY_PUBLISHED_LIST).await },
        );

        // 查询刚创建的博客并返回blog_id
        Ok(blog_id)
    }

    /// 公共的博客查询函数 - 联表查询用户信息，按创建时间倒序排列
    /// 使用事务确保数据一致性
    async fn query_blogs_with_filter<F>(state: Arc<AppState>, filter_fn: F) -> Result<Vec<BlogVO>>
    where
        F: FnOnce(
            sea_orm::Select<crate::models::blog::Entity>,
        ) -> sea_orm::Select<crate::models::blog::Entity>,
    {
        let postgres = &state.postgres;

        // 开始只读事务，确保数据一致性
        let txn = postgres.begin().await?;

        // 构建基础查询，联表查询用户信息
        let base_query = crate::models::blog::Entity::find()
            .join(
                JoinType::InnerJoin,
                crate::models::blog::Relation::User.def(),
            )
            .select_only()
            // 选择博客信息字段
            .column_as(crate::models::blog::Column::BlogId, "blog_id")
            .column_as(crate::models::blog::Column::Title, "title")
            .column_as(crate::models::blog::Column::Content, "content")
            .column_as(crate::models::blog::Column::Publish, "publish")
            .column_as(crate::models::blog::Column::CreatedAt, "created_at")
            .column_as(crate::models::blog::Column::UpdatedAt, "updated_at")
            // 选择用户信息字段
            .column_as(crate::models::user::Column::Id, "user_id")
            .column_as(crate::models::user::Column::AvatarUrl, "user_avatar_url")
            .column_as(crate::models::user::Column::Username, "user_username")
            .column_as(crate::models::user::Column::Email, "user_email")
            .column_as(crate::models::user::Column::Permission, "user_permission");

        // 应用过滤条件并执行查询
        let blogs_data = filter_fn(base_query)
            // 按创建时间倒序排列
            .order_by_desc(crate::models::blog::Column::CreatedAt)
            .into_model::<BlogWithUser>()
            .all(&txn)
            .await?;

        // 获取所有博客ID
        let blog_ids: Vec<String> = blogs_data.iter().map(|blog| blog.blog_id.clone()).collect();

        // 在同一个事务中批量获取所有博客的标签
        let blogs_tags = Self::get_blogs_tags_in_txn(&blog_ids, &txn).await?;

        // 提交事务
        txn.commit().await?;

        // 组装BlogVO
        let blog_vos: Vec<BlogVO> = blogs_data
            .into_iter()
            .map(|blog_with_user| {
                let tags = blogs_tags
                    .get(&blog_with_user.blog_id)
                    .cloned()
                    .unwrap_or_default();
                let blog_vo: BlogVO = blog_with_user.into();
                blog_vo.with_tags(tags)
            })
            .collect();

        Ok(blog_vos)
    }

    /// 查询所有博客列表 - 根据权限过滤
    /// 权限过滤：只显示权限低于当前用户的博客作者创建的博客，或者自己创建的博客
    pub async fn read_blog(
        state: Arc<AppState>,
        current_user_id: i64,
        current_user_permission: i16,
    ) -> Result<Vec<BlogVO>> {
        Self::query_blogs_with_filter(state, |query| {
            query.filter(
                sea_orm::Condition::any()
                    .add(crate::models::user::Column::Permission.lt(current_user_permission))
                    .add(crate::models::blog::Column::CreatedBy.eq(current_user_id)),
            )
        })
        .await
    }

    /// 查询所有已发布的博客列表 - 公开接口，不需要权限验证
    pub async fn read_published_blog(state: Arc<AppState>) -> Result<Vec<BlogVO>> {
        // 尝试从缓存获取
        if let Some(blogs) =
            get_cache::<Vec<BlogVO>>(state.clone(), Self::CACHE_KEY_PUBLISHED_LIST).await?
        {
            return Ok(blogs);
        }

        // 缓存未命中，从数据库查询
        let blogs = Self::query_blogs_with_filter(state.clone(), |query| {
            query.filter(crate::models::blog::Column::Publish.eq(true))
        })
        .await?;

        // 异步设置缓存，不阻塞主函数
        let blogs_for_cache = blogs.clone();
        tokio::spawn(async move {
            set_cache(
                state,
                Self::CACHE_KEY_PUBLISHED_LIST,
                &blogs_for_cache,
                Self::CACHE_EXPIRE_PUBLISHED_LIST,
            )
            .await
        });

        Ok(blogs)
    }

    /// 根据 blog_id 查询单个博客 - 带权限控制
    /// 权限逻辑：
    /// - 如果博客已发布（publish = true），任何人都可以查询
    /// - 如果博客未发布，只能查询权限低于当前用户的博客作者创建的博客，或者自己创建的博客
    pub async fn read_blog_by_id(
        state: Arc<AppState>,
        blog_id: String,
        current_user_id: Option<i64>,
        current_user_permission: Option<i16>,
    ) -> Result<BlogVO> {
        let blogs = Self::query_blogs_with_filter(state, |query| {
            let mut condition =
                sea_orm::Condition::all().add(crate::models::blog::Column::BlogId.eq(blog_id));

            // 权限过滤逻辑
            match (current_user_id, current_user_permission) {
                (Some(user_id), Some(user_permission)) => {
                    // 已登录用户：可以查看已发布的博客，或者符合权限条件的未发布博客
                    condition = condition.add(
                        sea_orm::Condition::any()
                            // 条件1：博客已发布，任何人都可以查看
                            .add(crate::models::blog::Column::Publish.eq(true))
                            // 条件2：未发布的博客，但是作者权限低于当前用户或者是自己创建的
                            .add(
                                sea_orm::Condition::all()
                                    .add(crate::models::blog::Column::Publish.eq(false))
                                    .add(
                                        sea_orm::Condition::any()
                                            .add(
                                                crate::models::user::Column::Permission
                                                    .lt(user_permission),
                                            )
                                            .add(
                                                crate::models::blog::Column::CreatedBy.eq(user_id),
                                            ),
                                    ),
                            ),
                    );
                }
                _ => {
                    // 未登录用户：只能查看已发布的博客
                    condition = condition.add(crate::models::blog::Column::Publish.eq(true));
                }
            }

            query.filter(condition)
        })
        .await?;

        match blogs.into_iter().next() {
            Some(blog) => Ok(blog),
            None => Err(anyhow!("WARN:博客不存在或无权限访问")),
        }
    }

    /// 在事务中批量获取博客标签的辅助函数
    async fn get_blogs_tags_in_txn(
        blog_ids: &[String],
        txn: &sea_orm::DatabaseTransaction,
    ) -> Result<HashMap<String, Vec<TagVO>>> {
        if blog_ids.is_empty() {
            return Ok(HashMap::new());
        }

        // 在事务中查询所有博客标签关联关系
        let blog_tags_data = crate::models::blog_tag::Entity::find()
            .filter(crate::models::blog_tag::Column::BlogId.is_in(blog_ids.iter().cloned()))
            .all(txn)
            .await?;

        // 收集所有标签ID
        let tag_ids: Vec<String> = blog_tags_data.iter().map(|bt| bt.tag_id.clone()).collect();

        if tag_ids.is_empty() {
            return Ok(HashMap::new());
        }

        // 在事务中批量查询所有标签信息
        let tags_data = crate::models::tag::Entity::find()
            .filter(crate::models::tag::Column::TagId.is_in(tag_ids))
            .all(txn)
            .await?;

        // 创建标签ID到标签信息的映射
        let tag_map: HashMap<String, TagVO> = tags_data
            .into_iter()
            .map(|tag| {
                (
                    tag.tag_id.clone(),
                    TagVO::new(tag.tag_id.clone(), tag.tag_name.clone()),
                )
            })
            .collect();

        // 组织博客ID到标签列表的映射 - 使用函数式编程优化
        let blogs_tags: HashMap<String, Vec<TagVO>> = blog_tags_data
            .into_iter()
            .filter_map(|blog_tag| {
                tag_map
                    .get(&blog_tag.tag_id)
                    .map(|tag_vo| (blog_tag.blog_id, tag_vo.clone()))
            })
            .fold(HashMap::new(), |mut acc, (blog_id, tag_vo)| {
                acc.entry(blog_id).or_default().push(tag_vo);
                acc
            });

        Ok(blogs_tags)
    }

    /// 更新博客服务 - 根据权限控制更新博客记录及其标签关联
    /// 权限控制：只能更新权限低于当前用户的博客作者创建的博客，或者自己创建的博客
    pub async fn update_blog(
        state: Arc<AppState>,
        blog_id: String,
        user_id: i64,
        user_permission: i16,
        blog_dto: BlogDTO,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询博客是否存在，同时联表查询创建者的权限信息
        let (blog, user) = match crate::models::blog::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::blog::Column::BlogId.eq(blog_id.clone()))
            .one(&txn)
            .await?
        {
            Some((blog, Some(user))) => (blog, user),
            Some((_, None)) => return Err(anyhow!("WARN:博客创建者不存在")),
            None => return Err(anyhow!("WARN:博客不存在")),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if blog.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!(
                "WARN:权限不足，只能更新自己创建的博客或权限低于自己的用户创建的博客"
            ));
        }

        // 更新博客记录 - 只更新提供的字段
        let mut blog_active: ActiveModel = blog.into();

        let title = validate_option_field!(blog_dto.title, "标题");
        blog_active.title = Set(title);

        if let Some(content) = blog_dto.content {
            blog_active.content = Set(Some(content));
        }

        if let Some(publish) = blog_dto.publish {
            blog_active.publish = Set(publish);
        }

        blog_active.updated_at = Set(chrono::Utc::now());
        blog_active.updated_by = Set(user_id);

        blog_active.update(&txn).await?;

        // 如果提供了标签ID，更新标签关联
        if let Some(tag_ids) = blog_dto.tag_ids {
            if tag_ids.is_empty() {
                return Err(anyhow!("WARN:标签不能为空"));
            }

            // 验证标签是否存在
            let existing_tags = crate::models::tag::Entity::find()
                .filter(crate::models::tag::Column::TagId.is_in(tag_ids.clone()))
                .all(&txn)
                .await?;

            if existing_tags.len() != tag_ids.len() {
                return Err(anyhow!("WARN:部分标签不存在"));
            }

            // 删除现有的标签关联
            crate::models::blog_tag::Entity::delete_many()
                .filter(crate::models::blog_tag::Column::BlogId.eq(blog_id.clone()))
                .exec(&txn)
                .await?;

            // 创建新的标签关联
            let now = chrono::Utc::now();
            let blog_tag_models: Vec<BlogTagActiveModel> = tag_ids
                .into_iter()
                .map(|tag_id| BlogTagActiveModel {
                    blog_id: Set(blog_id.clone()),
                    tag_id: Set(tag_id),
                    created_at: Set(now),
                    created_by: Set(user_id),
                    updated_at: Set(now),
                    updated_by: Set(user_id),
                    ..Default::default()
                })
                .collect();

            crate::models::blog_tag::Entity::insert_many(blog_tag_models)
                .exec(&txn)
                .await?;
        }

        // 提交事务
        txn.commit().await?;

        // 异步清除博客列表缓存，不阻塞主函数
        tokio::spawn(
            async move { clear_cache(state.clone(), Self::CACHE_KEY_PUBLISHED_LIST).await },
        );

        // 查询更新后的博客并返回
        Ok(())
    }

    /// 删除博客服务 - 根据权限控制删除博客记录及其标签关联
    /// 权限控制：只能删除权限低于当前用户的博客作者创建的博客，或者自己创建的博客
    pub async fn delete_blog(
        state: Arc<AppState>,
        blog_id: String,
        user_id: i64,
        user_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询博客是否存在，同时联表查询创建者的权限信息
        let (blog, user) = match crate::models::blog::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::blog::Column::BlogId.eq(blog_id.clone()))
            .one(&txn)
            .await?
        {
            Some((blog, Some(user))) => (blog, user),
            Some((_, None)) => return Err(anyhow!("WARN:博客创建者不存在")),
            None => return Err(anyhow!("WARN:博客不存在")),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if blog.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!(
                "WARN:权限不足，只能删除自己创建的博客或权限低于自己的用户创建的博客"
            ));
        }

        // 删除博客标签关联记录
        crate::models::blog_tag::Entity::delete_many()
            .filter(crate::models::blog_tag::Column::BlogId.eq(blog_id.clone()))
            .exec(&txn)
            .await?;

        // 删除博客记录
        crate::models::blog::Entity::delete_by_id(blog.id)
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除博客列表缓存，不阻塞主函数
        tokio::spawn(
            async move { clear_cache(state.clone(), Self::CACHE_KEY_PUBLISHED_LIST).await },
        );

        Ok(())
    }
}
