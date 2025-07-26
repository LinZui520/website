use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 标签数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub tag_id: String,
    #[sea_orm(unique)]
    pub tag_name: String,
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
    #[sea_orm(has_many = "super::blog_tag::Entity")]
    BlogTag,
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl Related<super::blog_tag::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::BlogTag.def()
    }
}

// 通过 blog_tags 表关联到 blogs 表
impl Related<super::blog::Entity> for Entity {
    fn to() -> RelationDef {
        super::blog_tag::Relation::Blog.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::blog_tag::Relation::Tag.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}

/// 统一的标签数据传输对象 - 用于所有API请求
/// 根据不同场景使用不同字段组合：
/// - 创建标签：tag_name
/// - 更新标签：tag_name
#[derive(Debug, Serialize, Deserialize)]
pub struct TagDTO {
    pub tag_name: Option<String>,
}

/// 标签视图对象 - 用于前端展示
#[derive(Debug, Clone, Serialize, Deserialize, sea_orm::FromQueryResult)]
pub struct TagVO {
    pub tag_id: String,
    pub tag_name: String,
}

impl TagVO {
    pub fn new(tag_id: String, tag_name: String) -> Self {
        Self { tag_id, tag_name }
    }
}

impl From<Model> for TagVO {
    fn from(tag: Model) -> Self {
        Self {
            tag_id: tag.tag_id,
            tag_name: tag.tag_name,
        }
    }
}
