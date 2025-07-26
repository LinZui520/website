use chrono::Utc;
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 博客标签关联数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "blog_tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub blog_id: String,
    pub tag_id: String,
    pub created_at: chrono::DateTime<Utc>,
    pub created_by: i64,
    pub updated_at: chrono::DateTime<Utc>,
    pub updated_by: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::blog::Entity",
        from = "Column::BlogId",
        to = "super::blog::Column::BlogId"
    )]
    Blog,
    #[sea_orm(
        belongs_to = "super::tag::Entity",
        from = "Column::TagId",
        to = "super::tag::Column::TagId"
    )]
    Tag,
}

impl Related<super::blog::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Blog.def()
    }
}

impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tag.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
