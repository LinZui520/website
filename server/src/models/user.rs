use chrono::{DateTime, Utc};
use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

/// 用户数据库模型
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub avatar_url: String,
    #[sea_orm(unique)]
    pub username: String,
    #[sea_orm(unique)]
    pub email: String,
    pub password_hashed: String,
    pub permission: i16,
    pub created_at: DateTime<Utc>,
    pub created_by: i64,
    pub updated_at: DateTime<Utc>,
    pub updated_by: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

/// 统一的用户数据传输对象 - 用于所有API请求
/// 根据不同场景使用不同字段组合：
/// - 登录：email + password
/// - 注册：username + email + password + verification_code
#[derive(Debug, Serialize, Deserialize)]
pub struct UserDTO {
    pub avatar_url: Option<String>,
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,          // 原始密码，将被哈希处理
    pub verification_code: Option<String>, // 验证码
    pub permission: Option<i16>,
}

/// 用户视图对象 - 用于前端展示，不包含敏感信息
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserVO {
    pub id: i64,
    pub avatar_url: String,
    pub username: String,
    pub email: String,
    pub permission: i16,
}

impl From<Model> for UserVO {
    fn from(user: Model) -> Self {
        Self {
            id: user.id,
            avatar_url: user.avatar_url,
            username: user.username,
            email: user.email,
            permission: user.permission,
        }
    }
}

/// 权限枚举
#[allow(dead_code)]
#[repr(i16)]
#[derive(Debug)]
pub enum Permission {
    /// 封禁用户
    Banned = -1,
    /// 普通用户
    User = 0,
    /// 管理员
    Admin = 1,
    /// 副站长
    Master = 2,
    /// 站长
    Root = 3,
}
