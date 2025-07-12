use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// SeaORM 实体 - 对应数据库中的 photo 表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "photo")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub author: i64,                                       // 上传者ID (外键到users表)
    pub filename: String,                                  // 原始文件名
    pub url: String,                                       // 图片URL路径
    pub description: Option<String>,                       // 图片描述
    pub location: String,                                  // 拍摄地点
    pub created_at: Option<chrono::DateTime<chrono::Utc>>, // 上传时间
}

/// 定义表关系
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 照片属于一个上传者 (多对一关系)
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

/// API 响应用的 Photo 结构体
#[derive(serde::Serialize)]
pub struct Photo {
    pub id: i64,
    pub author: i64,
    pub filename: String,
    pub url: String,
    pub description: Option<String>,
    pub location: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// 从 SeaORM Model 转换为 API Photo
impl From<Model> for Photo {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            author: model.author,
            filename: model.filename,
            url: model.url,
            description: model.description,
            location: model.location,
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}

/// 从 SeaORM Model 引用转换为 API Photo
impl From<&Model> for Photo {
    fn from(model: &Model) -> Self {
        Self {
            id: model.id,
            author: model.author,
            filename: model.filename.clone(),
            url: model.url.clone(),
            description: model.description.clone(),
            location: model.location.clone(),
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}

/// 用于联表查询的结构体，包含照片信息和作者信息
#[derive(Debug, serde::Deserialize, sea_orm::FromQueryResult)]
pub struct PhotoWithRelations {
    // 照片基本信息
    pub id: i64,
    pub filename: String,
    pub url: String,
    pub description: Option<String>,
    pub location: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,

    // 作者信息
    pub author_id: i64,
    pub author_avatar: String,
    pub author_username: String,
    pub author_email: String,
    pub author_permission: i32,
}

/// 包含作者信息的照片 DTO
#[derive(serde::Serialize)]
pub struct PhotoDTO {
    pub id: i64,
    pub author: crate::models::user::User,
    pub filename: String,
    pub url: String,
    pub description: Option<String>,
    pub location: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl PhotoWithRelations {
    /// 转换为 PhotoDTO
    pub fn into_photo_dto(self) -> PhotoDTO {
        PhotoDTO {
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
            description: self.description,
            location: self.location,
            created_at: self.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}
