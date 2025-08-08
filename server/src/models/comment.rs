use crate::models::user::UserVO;
use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 评论数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "comments")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub comment_id: String,
    pub content: String,
    pub target_id: String,
    pub parent_id: Option<String>,
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
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

/// 评论数据传输对象 - 用于创建和更新评论请求
#[derive(Debug, Serialize, Deserialize)]
pub struct CommentDTO {
    pub content: String,
    pub target_id: String,
    pub parent_id: Option<String>,
}

/// 父评论视图对象 - 用于表示回复评论，不包含嵌套结构
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ParentCommentVO {
    pub comment_id: String,
    pub content: String,
    pub target_id: String,
}

/// 评论视图对象 - 用于前端展示
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommentVO {
    pub comment_id: String,
    pub content: String,
    pub target_id: String,
    pub parent: Option<ParentCommentVO>,
    pub created_at: DateTime<Utc>,
    pub created_by: UserVO,
    pub updated_at: DateTime<Utc>,
}

/// 用于联表查询的结构体，包含评论信息和用户信息
#[derive(Debug, Clone, sea_orm::FromQueryResult)]
pub struct CommentWithUser {
    // 评论信息
    pub comment_id: String,
    pub content: String,
    pub target_id: String,
    pub parent_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    // 用户信息
    pub user_id: i64,
    pub user_avatar_url: String,
    pub user_username: String,
    pub user_email: String,
    pub user_permission: i16,
}

impl From<CommentWithUser> for CommentVO {
    fn from(comment_with_user: CommentWithUser) -> Self {
        Self {
            comment_id: comment_with_user.comment_id,
            content: comment_with_user.content,
            target_id: comment_with_user.target_id,
            parent: None, // 需要在服务层单独处理父评论信息
            created_at: comment_with_user.created_at,
            created_by: UserVO {
                id: comment_with_user.user_id,
                avatar_url: comment_with_user.user_avatar_url,
                username: comment_with_user.user_username,
                email: comment_with_user.user_email,
                permission: comment_with_user.user_permission,
            },
            updated_at: comment_with_user.updated_at,
        }
    }
}

impl From<CommentWithUser> for ParentCommentVO {
    fn from(comment_with_user: CommentWithUser) -> Self {
        Self {
            comment_id: comment_with_user.comment_id,
            content: comment_with_user.content,
            target_id: comment_with_user.target_id,
        }
    }
}
