use crate::models::{tag::TagVO, user::UserVO};
use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 博客数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "blogs")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub blog_id: String,
    #[sea_orm(unique)]
    pub title: String,
    pub content: Option<String>,
    pub publish: bool,
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

// 通过 blog_tags 表关联到 tags 表
impl Related<super::tag::Entity> for Entity {
    fn to() -> RelationDef {
        super::blog_tag::Relation::Tag.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::blog_tag::Relation::Blog.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}

/// 统一的博客数据传输对象 - 用于所有API请求
/// 根据不同场景使用不同字段组合：
/// - 创建博客：title, content, publish, tag_ids
/// - 更新博客：title, content, publish, tag_ids
#[derive(Debug, Serialize, Deserialize)]
pub struct BlogDTO {
    pub title: Option<String>,
    pub content: Option<String>,
    pub publish: Option<bool>,
    pub tag_ids: Option<Vec<String>>,
}

/// 博客视图对象 - 用于前端展示
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BlogVO {
    pub blog_id: String,
    pub title: String,
    pub content: Option<String>,
    pub publish: bool,
    pub tags: Vec<TagVO>,
    pub created_at: DateTime<Utc>,
    pub created_by: UserVO,
    pub updated_at: DateTime<Utc>,
}

/// 用于联表查询的结构体，包含博客信息和用户信息
#[derive(Debug, sea_orm::FromQueryResult)]
pub struct BlogWithUser {
    // 博客信息
    pub blog_id: String,
    pub title: String,
    pub content: Option<String>,
    pub publish: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    // 用户信息
    pub user_id: i64,
    pub user_avatar_url: String,
    pub user_username: String,
    pub user_email: String,
    pub user_permission: i16,
}

impl From<BlogWithUser> for BlogVO {
    fn from(blog_with_user: BlogWithUser) -> Self {
        Self {
            blog_id: blog_with_user.blog_id,
            title: blog_with_user.title,
            content: blog_with_user.content,
            publish: blog_with_user.publish,
            tags: Vec::new(),
            created_at: blog_with_user.created_at,
            created_by: UserVO {
                id: blog_with_user.user_id,
                avatar_url: blog_with_user.user_avatar_url,
                username: blog_with_user.user_username,
                email: blog_with_user.user_email,
                permission: blog_with_user.user_permission,
            },
            updated_at: blog_with_user.updated_at,
        }
    }
}

impl BlogVO {
    /// 设置博客的标签信息
    pub fn with_tags(mut self, tags: Vec<TagVO>) -> Self {
        self.tags = tags;
        self
    }
}
