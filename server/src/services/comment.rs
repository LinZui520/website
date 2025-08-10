use crate::AppState;
use crate::core::redis::{clear_cache, get_cache, set_cache};
use crate::models::comment::{
    ActiveModel, CommentDTO, CommentVO, CommentWithUser, ParentCommentVO,
};
use anyhow::{Result, anyhow};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, JoinType, QueryFilter, QueryOrder, QuerySelect,
    RelationTrait, Set, TransactionTrait,
};
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;
use uuid::Uuid;

pub struct CommentService;

impl CommentService {
    /// 评论列表缓存键前缀
    const CACHE_KEY_PREFIX: &'static str = "comments:target:";

    /// 评论列表缓存模式（用于批量清除所有评论缓存）
    pub const CACHE_PATTERN_ALL: &'static str = "comments:target:*";

    /// 评论列表缓存过期时间（秒）- 30分钟
    const CACHE_EXPIRE_LIST: Option<u64> = Some(1800);

    /// 创建评论服务 - 在数据库中创建评论记录
    pub async fn create_comment(
        state: Arc<AppState>,
        user_id: i64,
        comment_dto: CommentDTO,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 验证输入参数不能为空
        if comment_dto.content.trim().is_empty() {
            return Err(anyhow!("WARN:评论内容不能为空"));
        }

        if comment_dto.target_id.trim().is_empty() {
            return Err(anyhow!("WARN:目标ID不能为空"));
        }

        // 使用事务确保数据一致性和性能
        let txn = postgres.begin().await?;

        // 验证 target_id 是否存在于 board 表中
        let board_exists = crate::models::board::Entity::find()
            .filter(crate::models::board::Column::BoardId.eq(&comment_dto.target_id))
            .one(&txn)
            .await?
            .is_some();

        if !board_exists {
            return Err(anyhow!("WARN:目标对象不存在"));
        }

        // 验证父评论是否存在（如果指定了parent_id）
        if let Some(ref parent_id) = comment_dto.parent_id {
            let parent_exists = crate::models::comment::Entity::find()
                .filter(crate::models::comment::Column::CommentId.eq(parent_id))
                .one(&txn)
                .await?
                .is_some();

            if !parent_exists {
                txn.rollback().await?;
                return Err(anyhow!("WARN:父评论不存在"));
            }
        }

        // 生成唯一的comment_id
        let comment_id = format!("comment-{}", Uuid::new_v4());
        let now = chrono::Utc::now();

        // 创建评论记录
        let comment_active = ActiveModel {
            comment_id: Set(comment_id),
            content: Set(comment_dto.content),
            target_id: Set(comment_dto.target_id.clone()),
            parent_id: Set(comment_dto.parent_id),
            created_at: Set(now),
            created_by: Set(user_id),
            updated_at: Set(now),
            updated_by: Set(user_id),
            ..Default::default()
        };

        comment_active.insert(&txn).await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除目标对象的评论列表缓存，不阻塞主函数
        let target_id = comment_dto.target_id;
        tokio::spawn(async move {
            let cache_key = format!("{}{}", Self::CACHE_KEY_PREFIX, target_id);
            let _ = clear_cache(state, &cache_key).await;
        });

        Ok(())
    }

    /// 批量获取父评论信息，解决N+1查询问题
    async fn get_parent_comments_batch(
        txn: &sea_orm::DatabaseTransaction,
        parent_ids: Vec<String>,
        target_id: &str,
    ) -> Result<std::collections::HashMap<String, ParentCommentVO>> {
        // 一次性查询所有需要的父评论信息，只查询ParentCommentVO需要的字段
        let parent_comments = crate::models::comment::Entity::find()
            .filter(crate::models::comment::Column::CommentId.is_in(parent_ids))
            .filter(crate::models::comment::Column::TargetId.eq(target_id))
            .all(txn)
            .await?;

        // 使用迭代器一次性构建HashMap，性能更好
        let parent_comments_map: std::collections::HashMap<String, ParentCommentVO> =
            parent_comments
                .into_iter()
                .map(|comment| {
                    (
                        comment.comment_id.clone(),
                        ParentCommentVO {
                            comment_id: comment.comment_id,
                            content: comment.content,
                            target_id: comment.target_id,
                        },
                    )
                })
                .collect();

        Ok(parent_comments_map)
    }

    /// 根据target_id查询评论列表 - 联表查询用户信息，按创建时间正序排列
    pub async fn read_comment_by_target(
        state: Arc<AppState>,
        target_id: String,
    ) -> Result<Vec<CommentVO>> {
        let cache_key = format!("{}{}", Self::CACHE_KEY_PREFIX, target_id);

        // 尝试从缓存获取
        if let Some(comments) = get_cache::<Vec<CommentVO>>(state.clone(), &cache_key).await? {
            return Ok(comments);
        }

        let postgres = &state.postgres;

        // 使用事务确保读取操作的数据一致性
        let txn = postgres.begin().await?;

        // 缓存未命中，从数据库查询
        // 构建基础查询，联表查询用户信息
        let query = crate::models::comment::Entity::find()
            .filter(crate::models::comment::Column::TargetId.eq(&target_id))
            .join(
                JoinType::InnerJoin,
                crate::models::comment::Relation::User.def(),
            )
            .select_only()
            // 选择评论信息字段
            .column_as(crate::models::comment::Column::CommentId, "comment_id")
            .column_as(crate::models::comment::Column::Content, "content")
            .column_as(crate::models::comment::Column::TargetId, "target_id")
            .column_as(crate::models::comment::Column::ParentId, "parent_id")
            .column_as(crate::models::comment::Column::CreatedAt, "created_at")
            .column_as(crate::models::comment::Column::UpdatedAt, "updated_at")
            // 选择用户信息字段
            .column_as(crate::models::user::Column::Id, "user_id")
            .column_as(crate::models::user::Column::AvatarUrl, "user_avatar_url")
            .column_as(crate::models::user::Column::Username, "user_username")
            .column_as(crate::models::user::Column::Email, "user_email")
            .column_as(crate::models::user::Column::Permission, "user_permission")
            // 按创建时间正序排列（早的在后面）
            .order_by_desc(crate::models::comment::Column::CreatedAt);

        let comment_data = query.into_model::<CommentWithUser>().all(&txn).await?;

        // 收集所有需要的父评论ID
        let parent_ids: Vec<String> = comment_data
            .iter()
            .filter_map(|comment| comment.parent_id.as_ref())
            .cloned()
            .collect();

        // 批量获取所有父评论信息，解决N+1查询问题
        let parent_comments_map = if !parent_ids.is_empty() {
            Self::get_parent_comments_batch(&txn, parent_ids, &target_id).await?
        } else {
            std::collections::HashMap::new()
        };

        // 使用迭代器构建最终的评论列表，性能更好
        let final_comments: Vec<CommentVO> = comment_data
            .into_iter()
            .map(|comment_with_user| {
                // 先获取parent_id的克隆，再消费comment_with_user避免借用冲突
                let parent_id = comment_with_user.parent_id.clone();
                let mut comment_vo: CommentVO = comment_with_user.into();

                // 从批量获取的结果中填充父评论信息
                if let Some(parent_id) = parent_id {
                    comment_vo.parent = parent_comments_map.get(&parent_id).cloned();
                }

                comment_vo
            })
            .collect();

        // 提交读事务
        txn.commit().await?;

        // 异步设置缓存，不阻塞主函数
        let comments_for_cache = final_comments.clone();
        tokio::spawn(async move {
            set_cache(
                state,
                &cache_key,
                &comments_for_cache,
                Self::CACHE_EXPIRE_LIST,
            )
            .await
        });

        Ok(final_comments)
    }

    /// 删除评论及其所有子评论（批量删除）
    pub async fn delete_comment(
        state: Arc<AppState>,
        user_id: i64,
        user_permission: i16,
        comment_id: String,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 使用事务确保删除操作的原子性
        let txn = postgres.begin().await?;

        // 查询评论是否存在
        let comment = match crate::models::comment::Entity::find()
            .filter(crate::models::comment::Column::CommentId.eq(&comment_id))
            .one(&txn)
            .await?
        {
            Some(comment) => comment,
            None => return Err(anyhow!("WARN:评论不存在")),
        };

        let target_id = comment.target_id.clone();

        // 权限验证：评论所有者或者权限>=2的用户可以删除
        if comment.created_by != user_id && user_permission < 2 {
            return Err(anyhow!("WARN:权限不足，只能删除自己的评论或需要管理员权限"));
        }

        // 收集所有需要删除的评论ID（包括子评论）
        let comment_ids_to_delete = Self::collect_comment_ids_recursive(&txn, &comment_id).await?;

        // 批量删除所有评论
        crate::models::comment::Entity::delete_many()
            .filter(crate::models::comment::Column::CommentId.is_in(comment_ids_to_delete))
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除目标对象的评论列表缓存
        tokio::spawn(async move {
            let cache_key = format!("{}{}", Self::CACHE_KEY_PREFIX, target_id);
            let _ = clear_cache(state, &cache_key).await;
        });

        Ok(())
    }

    /// 递归收集所有需要删除的评论ID
    fn collect_comment_ids_recursive<'a>(
        txn: &'a sea_orm::DatabaseTransaction,
        comment_id: &'a str,
    ) -> Pin<Box<dyn Future<Output = Result<Vec<String>>> + Send + 'a>> {
        Box::pin(async move {
            // 将当前评论ID添加到结果列表
            let mut result = vec![comment_id.to_string()];

            // 查找所有以当前comment_id为父评论的子评论
            let child_comments = crate::models::comment::Entity::find()
                .filter(crate::models::comment::Column::ParentId.eq(comment_id))
                .all(txn)
                .await?;

            // 并行递归收集所有子评论的ID
            let futures: Vec<_> = child_comments
                .iter()
                .map(|child| Self::collect_comment_ids_recursive(txn, &child.comment_id))
                .collect();

            // 等待所有并行任务完成并合并结果
            for future in futures {
                let child_ids = future.await?;
                result.extend(child_ids);
            }

            Ok(result)
        })
    }
}
