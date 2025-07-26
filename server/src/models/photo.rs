use crate::models::user::UserVO;
use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 照片数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "photos")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub photo_id: String,
    #[sea_orm(unique)]
    pub photo_url: String,
    pub description: Option<String>,
    pub location: String,
    pub created_at: DateTime<Utc>,
    pub created_by: i64,
    pub updated_at: DateTime<Utc>,
    pub updated_by: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::CreatedBy\
        ",
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

/// 照片视图对象 - 用于前端展示
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PhotoVO {
    pub photo_id: String,
    pub photo_url: String,
    pub description: Option<String>,
    pub location: String,
    pub created_at: DateTime<Utc>,
    pub created_by: UserVO,
    pub updated_at: DateTime<Utc>,
}

/// 用于联表查询的结构体，包含照片信息和用户信息
#[derive(Debug, sea_orm::FromQueryResult)]
pub struct PhotoWithUser {
    // 照片信息
    pub photo_id: String,
    pub photo_url: String,
    pub description: Option<String>,
    pub location: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    // 用户信息
    pub user_id: i64,
    pub user_avatar_url: String,
    pub user_username: String,
    pub user_email: String,
    pub user_permission: i16,
}

impl From<PhotoWithUser> for PhotoVO {
    fn from(photo_with_user: PhotoWithUser) -> Self {
        Self {
            photo_id: photo_with_user.photo_id,
            photo_url: photo_with_user.photo_url,
            description: photo_with_user.description,
            location: photo_with_user.location,
            created_at: photo_with_user.created_at,
            created_by: UserVO {
                id: photo_with_user.user_id,
                avatar_url: photo_with_user.user_avatar_url,
                username: photo_with_user.user_username,
                email: photo_with_user.user_email,
                permission: photo_with_user.user_permission,
            },
            updated_at: photo_with_user.updated_at,
        }
    }
}
