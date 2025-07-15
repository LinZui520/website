use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// SeaORM 实体 - 对应数据库中的 pictures 表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "pictures")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub author: i64,                                       // 上传者ID (外键到users表)
    pub url: String,                                       // 图片URL路径
    pub filename: String,                                  // 原始文件名
    pub created_at: Option<chrono::DateTime<chrono::Utc>>, // 上传时间
}

/// 定义表关系
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 图片属于一个上传者 (多对一关系)
    #[sea_orm(
        belongs_to = "crate::models::user::Entity",
        from = "Column::Author",
        to = "crate::models::user::Column::Id"
    )]
    Author,
}

impl ActiveModelBehavior for ActiveModel {}

// 实现与 User 实体的关系
impl Related<crate::models::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Author.def()
    }
}

/// API 响应用的 Picture 结构体
#[derive(serde::Serialize)]
pub struct Picture {
    pub id: i64,
    pub author: i64,
    pub url: String,
    pub filename: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// 从 SeaORM Model 转换为 API Picture
impl From<Model> for Picture {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            author: model.author,
            url: model.url,
            filename: model.filename,
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}

/// 从 SeaORM Model 引用转换为 API Picture
impl From<&Model> for Picture {
    fn from(model: &Model) -> Self {
        Self {
            id: model.id,
            author: model.author,
            url: model.url.clone(),
            filename: model.filename.clone(),
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}

/// 用于联表查询的结构体，包含图片信息和作者信息
#[derive(Debug, serde::Deserialize, sea_orm::FromQueryResult)]
pub struct PictureWithRelations {
    // 图片基本信息
    pub id: i64,
    pub url: String,
    pub filename: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,

    // 作者信息
    pub author_id: i64,
    pub author_avatar: String,
    pub author_username: String,
    pub author_email: String,
    pub author_permission: i32,
}

/// 包含作者信息的图片 DTO
#[derive(serde::Serialize)]
pub struct PictureDTO {
    pub id: i64,
    pub author: crate::models::user::User,
    pub filename: String,
    pub url: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl PictureWithRelations {
    /// 转换为 PictureDTO
    pub fn into_picture_dto(self) -> PictureDTO {
        PictureDTO {
            id: self.id,
            author: crate::models::user::User {
                id: self.author_id,
                avatar: self.author_avatar,
                username: self.author_username,
                email: self.author_email,
                permission: self.author_permission,
            },
            filename: self.filename,
            url: self.url,
            created_at: self.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}
