use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// SeaORM 实体 - 对应数据库中的 tags 表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub name: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 标签通过中间表关联多篇博客文章 (多对多关系)
    #[sea_orm(has_many = "crate::models::blog_tag::Entity")]
    BlogTags,
}

impl ActiveModelBehavior for ActiveModel {}

// 实现与 Blog 实体的多对多关系（通过中间表）
impl Related<crate::models::blog::Entity> for Entity {
    fn to() -> RelationDef {
        crate::models::blog_tag::Relation::Blog.def()
    }

    fn via() -> Option<RelationDef> {
        Some(crate::models::blog_tag::Relation::Tag.def().rev())
    }
}

/// API 响应用的 Tag 结构体（用于 JSON 序列化）
#[derive(Clone, serde::Serialize)]
pub struct Tag {
    pub id: i64,
    pub name: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// 从 SeaORM Model 转换为 API Tag
impl From<Model> for Tag {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}

/// 从 SeaORM Model 引用转换为 API Tag
impl From<&Model> for Tag {
    fn from(model: &Model) -> Self {
        Self {
            id: model.id,
            name: model.name.clone(),
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}
