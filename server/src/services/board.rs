use crate::AppState;
use crate::core::redis::{clear_cache, get_cache, set_cache};
use crate::models::board::{ActiveModel, BoardDTO, BoardVO, BoardWithUser};
use anyhow::{Result, anyhow};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, JoinType, QueryFilter, QueryOrder, QuerySelect,
    RelationTrait, Set, TransactionTrait,
};
use std::sync::Arc;
use uuid::Uuid;

pub struct BoardService;

impl BoardService {
    /// 留言板列表缓存键
    pub const CACHE_KEY_LIST: &'static str = "boards:list";

    /// 留言板列表缓存过期时间（秒）- 无限缓存，依赖主动清除
    const CACHE_EXPIRE_LIST: Option<u64> = None;

    /// 创建留言板服务 - 在数据库中创建留言板记录
    pub async fn create_board(
        state: Arc<AppState>,
        user_id: i64,
        board_dto: BoardDTO,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 生成唯一的board_id
        let board_id = format!("board-{}", Uuid::new_v4());
        let now = chrono::Utc::now();

        // 创建留言板记录
        let board_active = ActiveModel {
            board_id: Set(board_id),
            name: Set(board_dto.name),
            description: Set(board_dto.description),
            created_at: Set(now),
            created_by: Set(user_id),
            updated_at: Set(now),
            updated_by: Set(user_id),
            ..Default::default()
        };

        board_active.insert(postgres).await?;

        // 异步清除留言板列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }

    /// 查询所有留言板列表 - 联表查询用户信息，按创建时间倒序排列
    pub async fn read_board(state: Arc<AppState>) -> Result<Vec<BoardVO>> {
        // 尝试从缓存获取
        if let Some(boards) = get_cache::<Vec<BoardVO>>(state.clone(), Self::CACHE_KEY_LIST).await?
        {
            return Ok(boards);
        }

        let postgres = &state.postgres;

        // 缓存未命中，从数据库查询
        // 构建基础查询，联表查询用户信息
        let query = crate::models::board::Entity::find()
            .join(
                JoinType::InnerJoin,
                crate::models::board::Relation::User.def(),
            )
            .select_only()
            // 选择留言板信息字段
            .column_as(crate::models::board::Column::BoardId, "board_id")
            .column_as(crate::models::board::Column::Name, "name")
            .column_as(crate::models::board::Column::Description, "description")
            .column_as(crate::models::board::Column::CreatedAt, "created_at")
            .column_as(crate::models::board::Column::UpdatedAt, "updated_at")
            // 选择用户信息字段
            .column_as(crate::models::user::Column::Id, "user_id")
            .column_as(crate::models::user::Column::AvatarUrl, "user_avatar_url")
            .column_as(crate::models::user::Column::Username, "user_username")
            .column_as(crate::models::user::Column::Email, "user_email")
            .column_as(crate::models::user::Column::Permission, "user_permission")
            // 按创建时间倒序排列
            .order_by_desc(crate::models::board::Column::CreatedAt);

        let boards = query
            .into_model::<BoardWithUser>()
            .all(postgres)
            .await?
            .into_iter()
            .map(|item| item.into())
            .collect::<Vec<BoardVO>>();

        // 异步设置缓存，不阻塞主函数
        let boards_for_cache = boards.clone();
        tokio::spawn(async move {
            set_cache(
                state,
                Self::CACHE_KEY_LIST,
                &boards_for_cache,
                Self::CACHE_EXPIRE_LIST,
            )
            .await
        });

        Ok(boards)
    }

    /// 更新留言板服务 - 根据权限控制更新留言板信息
    /// 权限控制：只能更新权限低于当前用户的留言板作者创建的留言板，或者自己创建的留言板
    pub async fn update_board(
        state: Arc<AppState>,
        board_id: String,
        user_id: i64,
        user_permission: i16,
        board_dto: BoardDTO,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询留言板是否存在，同时联表查询创建者的权限信息
        let (board, user) = match crate::models::board::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::board::Column::BoardId.eq(board_id.clone()))
            .one(&txn)
            .await?
        {
            Some((board, Some(user))) => (board, user),
            Some((_, None)) => return Err(anyhow!("WARN:留言板创建者不存在")),
            None => return Err(anyhow!("WARN:留言板不存在")),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if board.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!(
                "WARN:权限不足，只能更新自己创建的留言板或权限低于自己的用户创建的留言板"
            ));
        }

        // 更新留言板记录
        let mut board_active: ActiveModel = board.into();

        board_active.name = Set(board_dto.name);
        board_active.description = Set(board_dto.description);
        board_active.updated_at = Set(chrono::Utc::now());
        board_active.updated_by = Set(user_id);

        board_active.update(&txn).await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除留言板列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }

    /// 删除留言板服务 - 根据 board_id 删除留言板记录
    pub async fn delete_board(
        state: Arc<AppState>,
        board_id: String,
        user_id: i64,
        user_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询留言板是否存在，同时联表查询创建者的权限信息
        let (board, user) = match crate::models::board::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::board::Column::BoardId.eq(board_id.clone()))
            .one(&txn)
            .await?
        {
            Some((board, Some(user))) => (board, user),
            Some((_, None)) => return Err(anyhow!("WARN:留言板创建者不存在: {}", board_id)),
            None => return Err(anyhow!("WARN:留言板不存在: {}", board_id)),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if board.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!("WARN:权限不足，只能删除自己创建的留言板"));
        }

        // 删除数据库记录
        crate::models::board::Entity::delete_by_id(board.id)
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除留言板列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }
}
