use crate::models::user::User;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// SeaORM 实体 - 对应数据库中的 blogs 表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "blogs")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub author: i64,                                       // 作者ID (外键到users表)
    pub title: String,                                     // 博客标题
    pub content: String,                                   // 博客内容
    pub publish: bool,                                     // 是否发布
    pub created_at: Option<chrono::DateTime<chrono::Utc>>, // 创建时间
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>, // 更新时间
    pub updated_by: i64,                                   // 最后更新人ID (外键到users表)
}

/// 定义表关系
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 博客属于一个作者 (多对一关系)
    #[sea_orm(
        belongs_to = "crate::models::user::Entity",
        from = "Column::Author",
        to = "crate::models::user::Column::Id"
    )]
    Author,

    /// 博客有一个更新者 (多对一关系)
    #[sea_orm(
        belongs_to = "crate::models::user::Entity",
        from = "Column::UpdatedBy",
        to = "crate::models::user::Column::Id"
    )]
    UpdatedByUser,

    /// 博客通过中间表关联多个标签 (多对多关系)
    #[sea_orm(has_many = "crate::models::blog_tag::Entity")]
    BlogTags,
}

impl ActiveModelBehavior for ActiveModel {}

// 实现与 User 实体的关系（作者关系）
impl Related<crate::models::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Author.def()
    }
}

// 实现与 Tag 实体的多对多关系（通过中间表）
impl Related<crate::models::tag::Entity> for Entity {
    fn to() -> RelationDef {
        crate::models::blog_tag::Relation::Tag.def()
    }

    fn via() -> Option<RelationDef> {
        Some(crate::models::blog_tag::Relation::Blog.def().rev())
    }
}

/// API 响应用的 Blog 结构体（简化版，包含外键ID）
#[derive(serde::Serialize)]
pub struct Blog {
    pub id: i64,
    pub author: i64,
    pub title: String,
    pub content: String,
    pub publish: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub updated_by: i64,
}

/// API 响应用的 BlogDTO 结构体（完整版，包含关联对象）
#[derive(serde::Serialize)]
pub struct BlogDTO {
    pub id: i64,
    pub author: User,
    pub title: String,
    pub tags: Vec<crate::models::tag::Tag>,
    pub content: String,
    pub publish: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub updated_by: i64,
}

/// 从 SeaORM Model 转换为简化的 Blog
impl From<Model> for Blog {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            author: model.author,
            title: model.title,
            content: model.content,
            publish: model.publish,
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
            updated_at: model.updated_at.unwrap_or_else(chrono::Utc::now),
            updated_by: model.updated_by,
        }
    }
}

/// 从 SeaORM Model 引用转换为简化的 Blog
impl From<&Model> for Blog {
    fn from(model: &Model) -> Self {
        Self {
            id: model.id,
            author: model.author,
            title: model.title.clone(),
            content: model.content.clone(),
            publish: model.publish,
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
            updated_at: model.updated_at.unwrap_or_else(chrono::Utc::now),
            updated_by: model.updated_by,
        }
    }
}

// 自定义模型用于接收联表查询结果
#[derive(sea_orm::FromQueryResult)]
pub struct BlogWithRelations {
    // Blog 字段
    pub id: i64,
    pub title: String,
    pub content: String,
    pub publish: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub updated_by: i64,

    // User 字段（作者）
    pub author_id: i64,
    pub author_avatar: String,
    pub author_username: String,
    pub author_email: String,
    pub author_permission: i32,
}

impl BlogWithRelations {
    /// 转换为 BlogDTO（需要单独查询标签）
    pub fn into_blog_dto(self, tags: Vec<crate::models::tag::Tag>) -> BlogDTO {
        BlogDTO {
            id: self.id,
            author: User::new(
                self.author_id,
                self.author_avatar,
                self.author_username,
                self.author_email,
                self.author_permission,
            ),
            title: self.title,
            tags, // 传入的标签数组
            content: self.content,
            publish: self.publish,
            created_at: self.created_at,
            updated_at: self.updated_at,
            updated_by: self.updated_by,
        }
    }
}
