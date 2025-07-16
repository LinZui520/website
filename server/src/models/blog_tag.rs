use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// SeaORM 实体 - 对应数据库中的 blog_tags 中间表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "blog_tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub blog_id: i64,
    #[sea_orm(primary_key)]
    pub tag_id: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 中间表关联到博客 (多对一关系)
    #[sea_orm(
        belongs_to = "crate::models::blog::Entity",
        from = "Column::BlogId",
        to = "crate::models::blog::Column::Id"
    )]
    Blog,

    /// 中间表关联到标签 (多对一关系)
    #[sea_orm(
        belongs_to = "crate::models::tag::Entity",
        from = "Column::TagId",
        to = "crate::models::tag::Column::Id"
    )]
    Tag,
}

impl ActiveModelBehavior for ActiveModel {}

// 实现与 Blog 实体的关系
impl Related<crate::models::blog::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Blog.def()
    }
}

// 实现与 Tag 实体的关系
impl Related<crate::models::tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Tag.def()
    }
}
