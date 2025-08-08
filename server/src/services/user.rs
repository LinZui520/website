use crate::AppState;
use crate::core::redis::clear_cache;
use crate::models::user::{ActiveModel, Entity as UserEntity, UserVO};
use crate::services::blog::BlogService;
use crate::services::board::BoardService;
use crate::services::photo::PhotoService;
use anyhow::{Result, anyhow};
use sea_orm::{ActiveModelTrait, EntityTrait, QueryOrder, Set};
use std::sync::Arc;

pub struct UserService;

impl UserService {
    /// 获取用户列表服务
    pub async fn list_users(state: Arc<AppState>) -> Result<Vec<UserVO>> {
        let postgres = &state.postgres;

        // 查询所有用户，按创建时间倒序排列
        let users = UserEntity::find()
            .order_by_desc(crate::models::user::Column::CreatedAt)
            .all(postgres)
            .await?
            .into_iter()
            .map(|user| user.into())
            .collect();

        Ok(users)
    }

    /// 提升用户权限服务
    pub async fn increase_user_permission(
        state: Arc<AppState>,
        target_id: i64,
        operator_id: i64,
        operator_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 查询目标用户
        let target_user = match UserEntity::find_by_id(target_id).one(postgres).await? {
            Some(user) => user,
            None => return Err(anyhow!("WARN:用户不存在")),
        };

        // 检查是否是操作自己
        if operator_id == target_user.id {
            return Err(anyhow!("WARN:不能修改自己的权限"));
        }

        let new_permission = target_user.permission + 1;

        // 检查提升后的权限不能达到或超过操作者的权限
        if new_permission >= operator_permission {
            return Err(anyhow!("WARN:不能提升用户权限到与自己平级或更高"));
        }

        // 检查权限上限（不能超过Root权限）
        if new_permission > 3 {
            return Err(anyhow!("WARN:用户权限已达到最高级别"));
        }

        // 更新用户权限
        let user_active = ActiveModel {
            id: Set(target_user.id),
            permission: Set(new_permission),
            updated_at: Set(chrono::Utc::now()),
            updated_by: Set(operator_id),
            ..Default::default()
        };

        user_active.update(postgres).await?;

        // 异步清除相关缓存，不阻塞主函数
        tokio::spawn(async move {
            // 清除博客列表缓存，因为博客中包含用户头像信息
            let _ = clear_cache(state.clone(), BlogService::CACHE_KEY_PUBLISHED_LIST).await;
            // 清除照片列表缓存，因为照片中包含用户信息
            let _ = clear_cache(state.clone(), PhotoService::CACHE_KEY_LIST).await;
            // 清除留言板列表缓存，因为留言板中包含用户信息
            let _ = clear_cache(state.clone(), BoardService::CACHE_KEY_LIST).await;
        });

        Ok(())
    }

    /// 降低用户权限服务
    pub async fn decrease_user_permission(
        state: Arc<AppState>,
        target_id: i64,
        operator_id: i64,
        operator_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 查询目标用户
        let target_user = match UserEntity::find_by_id(target_id).one(postgres).await? {
            Some(user) => user,
            None => return Err(anyhow!("WARN:用户不存在")),
        };

        // 检查是否是操作自己
        if operator_id == target_user.id {
            return Err(anyhow!("WARN:不能修改自己的权限"));
        }

        // 检查不能降低权限大于等于自己的用户
        if target_user.permission >= operator_permission {
            return Err(anyhow!("WARN:不能降低权限大于等于自己的用户"));
        }

        let new_permission = target_user.permission - 1;

        // 检查权限下限（不能低于Block权限）
        if new_permission < -1 {
            return Err(anyhow!("WARN:用户权限已达到最低级别"));
        }

        // 更新用户权限
        let user_active = ActiveModel {
            id: Set(target_user.id),
            permission: Set(new_permission),
            updated_at: Set(chrono::Utc::now()),
            updated_by: Set(operator_id),
            ..Default::default()
        };

        user_active.update(postgres).await?;

        // 异步清除相关缓存，不阻塞主函数
        tokio::spawn(async move {
            // 清除博客列表缓存，因为博客中包含用户头像信息
            let _ = clear_cache(state.clone(), BlogService::CACHE_KEY_PUBLISHED_LIST).await;
            // 清除照片列表缓存，因为照片中包含用户信息
            let _ = clear_cache(state.clone(), PhotoService::CACHE_KEY_LIST).await;
            // 清除留言板列表缓存，因为留言板中包含用户信息
            let _ = clear_cache(state.clone(), BoardService::CACHE_KEY_LIST).await;
        });

        Ok(())
    }
}
