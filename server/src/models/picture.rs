use crate::models::user::UserVO;
use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 图片数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "pictures")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub picture_id: String,
    #[sea_orm(unique)]
    pub picture_url: String,
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

/// 图片视图对象 - 用于前端展示
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PictureVO {
    pub picture_id: String,
    pub picture_url: String,
    pub created_at: DateTime<Utc>,
    pub created_by: UserVO,
    pub updated_at: DateTime<Utc>,
}

/// 用于联表查询的结构体，包含图片信息和用户信息
#[derive(Debug, sea_orm::FromQueryResult)]
pub struct PictureWithUser {
    // 图片信息
    pub picture_id: String,
    pub picture_url: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    // 用户信息
    pub user_id: i64,
    pub user_avatar_url: String,
    pub user_username: String,
    pub user_email: String,
    pub user_permission: i16,
}

impl From<PictureWithUser> for PictureVO {
    fn from(picture_with_user: PictureWithUser) -> Self {
        Self {
            picture_id: picture_with_user.picture_id,
            picture_url: picture_with_user.picture_url,
            created_at: picture_with_user.created_at,
            created_by: UserVO {
                id: picture_with_user.user_id,
                avatar_url: picture_with_user.user_avatar_url,
                username: picture_with_user.user_username,
                email: picture_with_user.user_email,
                permission: picture_with_user.user_permission,
            },
            updated_at: picture_with_user.updated_at,
        }
    }
}
