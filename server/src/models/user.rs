use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[allow(dead_code)]
#[repr(i32)]
pub enum Permission {
    Block = -1,
    User = 0,
    Admin = 1,
    Master = 2,
    Root = 3,
}

/// SeaORM 实体 - 对应数据库中的 users 表
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub avatar: String,
    pub username: String,
    pub email: String,
    pub password: String,
    pub permission: i32,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// 用户有多篇博客文章 (一对多关系)
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

/// API 响应用的 User 结构体（不包含敏感信息）
#[derive(serde::Serialize)]
pub struct User {
    pub id: i64,
    pub avatar: String,
    pub username: String,
    pub email: String,
    pub permission: i32,
}

impl User {
    pub fn new(id: i64, avatar: String, username: String, email: String, permission: i32) -> Self {
        Self {
            id,
            avatar,
            username,
            email,
            permission,
        }
    }
}

#[derive(serde::Serialize)]
pub struct UserDTO {
    pub user: User,
    pub token: String,
}

/// 从 SeaORM Model 转换为 API User（去除敏感信息）
impl From<Model> for User {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            avatar: model.avatar,
            username: model.username,
            email: model.email,
            permission: model.permission,
        }
    }
}

/// 从 SeaORM Model 引用转换为 API User
impl From<&Model> for User {
    fn from(model: &Model) -> Self {
        Self {
            id: model.id,
            avatar: model.avatar.clone(),
            username: model.username.clone(),
            email: model.email.clone(),
            permission: model.permission,
        }
    }
}
