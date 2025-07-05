use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// SeaORM 实体 - 对应数据库中的 categories 表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "categories")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub name: String,
    pub description: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 分类有多篇博客文章 (一对多关系)
    #[sea_orm(has_many = "crate::models::blog::Entity")]
    Blogs,
}

impl ActiveModelBehavior for ActiveModel {}

// 实现与 Blog 实体的关系
impl Related<crate::models::blog::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Blogs.def()
    }
}

/// API 响应用的 Category 结构体（用于 JSON 序列化）
#[derive(Clone, serde::Serialize)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl Category {
    pub fn new(
        id: i64,
        name: String,
        description: String,
        created_at: chrono::DateTime<chrono::Utc>,
    ) -> Self {
        Self {
            id,
            name,
            description,
            created_at,
        }
    }
}

/// 从 SeaORM Model 转换为 API CategoryDTO
impl From<Model> for Category {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            description: model.description,
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}

/// 从 SeaORM Model 引用转换为 API CategoryDTO
impl From<&Model> for Category {
    fn from(model: &Model) -> Self {
        Self {
            id: model.id,
            name: model.name.clone(),
            description: model.description.clone(),
            created_at: model.created_at.unwrap_or_else(chrono::Utc::now),
        }
    }
}
