use crate::models::user::UserVO;
use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 留言板数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "boards")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub board_id: String,
    #[sea_orm(unique)]
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub created_by: i64,
    pub updated_at: DateTime<Utc>,
    pub updated_by: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::CreatedBy",
        to = "super::user::Column::Id"
    )]
    User,
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

/// 留言板数据传输对象 - 用于更新留言板请求
#[derive(Debug, Serialize, Deserialize)]
pub struct BoardDTO {
    pub name: String,
    pub description: Option<String>,
}

/// 留言板视图对象 - 用于前端展示
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BoardVO {
    pub board_id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub created_by: UserVO,
    pub updated_at: DateTime<Utc>,
}

/// 用于联表查询的结构体，包含留言板信息和用户信息
#[derive(Debug, sea_orm::FromQueryResult)]
pub struct BoardWithUser {
    // 留言板信息
    pub board_id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    // 用户信息
    pub user_id: i64,
    pub user_avatar_url: String,
    pub user_username: String,
    pub user_email: String,
    pub user_permission: i16,
}

impl From<BoardWithUser> for BoardVO {
    fn from(board_with_user: BoardWithUser) -> Self {
        Self {
            board_id: board_with_user.board_id,
            name: board_with_user.name,
            description: board_with_user.description,
            created_at: board_with_user.created_at,
            created_by: UserVO {
                id: board_with_user.user_id,
                avatar_url: board_with_user.user_avatar_url,
                username: board_with_user.user_username,
                email: board_with_user.user_email,
                permission: board_with_user.user_permission,
            },
            updated_at: board_with_user.updated_at,
        }
    }
}
