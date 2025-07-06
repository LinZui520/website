use crate::core::env::env;
use crate::core::jwt::{UserCredentials, generate_jwt, parse_jwt, verify_jwt};
use crate::core::mail::{generate_random_code, is_valid_email, send_verification_email};
use crate::models::response::Response;
use crate::models::user::{ActiveModel, Column, Entity as UserEntity, User, UserDTO};
use crate::{AppState, validate_field};
use axum::http::HeaderMap;
use axum::{Extension, Json};
use bcrypt::{hash, verify};
use chrono::Local;
use deadpool_redis::redis::AsyncCommands;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set, TransactionTrait};
use serde_json::Value;
use std::sync::{Arc, OnceLock};

pub async fn verification_code(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let mut redis = match state.redis.get().await {
        Ok(redis) => redis,
        Err(err) => return Response::error(format!("获取Redis连接失败: {err}")),
    };

    let email = match form.get("email").and_then(|v| v.as_str()) {
        Some(email) if is_valid_email(email) => email,
        Some(_) => return Response::warn("邮箱格式不正确"),
        None => return Response::warn("邮箱字段缺失或格式错误"),
    };

    match redis.exists::<&str, bool>(email).await {
        Ok(true) => {
            return Response::warn(
                format!(
                    "验证码已发送，请{}秒后再试",
                    redis.ttl(email).await.unwrap_or(0)
                )
                .as_str(),
            );
        }
        Ok(false) => {}
        Err(err) => return Response::error(format!("Redis查询失败: {err}")),
    }

    let code: u32 = generate_random_code();
    match send_verification_email(&state.mailer, email.to_owned(), code.to_string()).await {
        Ok(_) => {}
        Err(err) => return Response::error(format!("发送验证邮件失败: {err}")),
    }

    match redis
        .set_ex::<&str, u32, bool>(email, code.to_owned(), 300)
        .await
    {
        Ok(_) => Response::success((), "验证码发送成功"),
        Err(err) => Response::error(format!("保存验证码失败: {err}")),
    }
}

static DEFAULT_AVATAR: OnceLock<String> = OnceLock::new();

pub async fn register(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let postgres = &state.postgres;
    let mut redis = match state.redis.get().await {
        Ok(redis) => redis,
        Err(err) => return Response::error(format!("获取Redis连接失败: {err}")),
    };

    let username = validate_field!(form, "username", "用户名");
    let email = validate_field!(form, "email", "邮箱");
    let password = validate_field!(form, "password", "密码");
    let code = validate_field!(form, "code", "验证码");

    if code
        != match redis.get::<&str, u32>(email).await {
            Ok(code) => code.to_string(),
            Err(_) => return Response::warn("未查询到验证码"),
        }
    {
        return Response::warn("验证码错误");
    }

    let hashed = match hash(password, 4) {
        Ok(hashed) => hashed,
        Err(err) => return Response::error(format!("密码加密失败: {err}")),
    };

    let avatar = DEFAULT_AVATAR.get_or_init(|| env("WEBSITE_USER_DEFAULT_AVATAR"));

    let user = ActiveModel {
        avatar: Set(avatar.to_owned()),
        username: Set(username.to_owned()),
        email: Set(email.to_owned()),
        password: Set(hashed),
        permission: Set(0), // 默认权限为普通用户
        created_at: Set(Some(chrono::Utc::now())),
        ..Default::default()
    };

    match user.insert(postgres).await {
        Ok(_) => Response::success((), "注册成功"),
        Err(err) => Response::error(format!("用户注册失败: {err}")),
    }
}

pub async fn login(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<UserDTO> {
    let postgres = &state.postgres;

    let email = validate_field!(form, "email", "邮箱");
    let password = validate_field!(form, "password", "密码");

    // 根据邮箱查找用户
    let user = match UserEntity::find()
        .filter(Column::Email.eq(email))
        .one(postgres)
        .await
    {
        Ok(Some(user)) => user,
        Ok(None) => return Response::warn("登录失败，用户不存在"),
        Err(err) => return Response::error(format!("查询用户失败: {err}")),
    };

    // 验证密码
    if !verify(password, &user.password).unwrap_or(false) {
        return Response::warn("邮箱或密码错误");
    }

    // 创建 JWT 用户凭证
    let user_credentials = UserCredentials {
        avatar: user.avatar.to_owned(),
        username: user.username.to_owned(),
        email: user.email.to_owned(),
        permission: user.permission,
    };

    // 生成 JWT token
    let token = match generate_jwt(user.id, user_credentials) {
        Ok(token) => token,
        Err(err) => return Response::error(format!("生成JWT失败: {err}")),
    };

    Response::success(
        UserDTO {
            user: User {
                id: user.id,
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                permission: user.permission,
            },
            token,
        },
        "登录成功",
    )
}

pub async fn token_login(headers: HeaderMap) -> Response<UserDTO> {
    let token = match parse_jwt(headers) {
        Some(token) => token,
        None => return Response::warn("JWT 不存在"),
    };

    let claims = match verify_jwt(token.as_str()) {
        Ok(claims) => claims,
        Err(err) => return Response::error(format!("JWT验证失败: {err}")),
    };

    if Local::now().timestamp() > claims.exp {
        return Response::warn("JWT 已过期");
    }

    Response::success(
        UserDTO {
            user: User {
                id: claims.sub,
                avatar: claims.user.avatar,
                username: claims.user.username,
                email: claims.user.email,
                permission: claims.user.permission,
            },
            token,
        },
        "登录成功",
    )
}
pub async fn reset_password(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let postgres = &state.postgres;
    let mut redis = match state.redis.get().await {
        Ok(redis) => redis,
        Err(err) => return Response::error(format!("获取Redis连接失败: {err}")),
    };

    // 验证表单字段
    let email = validate_field!(form, "email", "邮箱");
    let password = validate_field!(form, "password", "密码");
    let code = validate_field!(form, "code", "验证码");

    // 验证验证码
    if code
        != match redis.get::<&str, u32>(email).await {
            Ok(code) => code.to_string(),
            Err(_) => return Response::warn("未查询到验证码"),
        }
    {
        return Response::warn("验证码错误");
    }

    // 哈希新密码（在事务外进行，避免长时间占用事务）
    let hashed = match hash(password, 4) {
        Ok(hashed) => hashed,
        Err(err) => return Response::error(format!("密码加密失败: {err}")),
    };

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => return Response::error(format!("开始事务失败: {err}")),
    };

    // 在事务中查找用户是否存在
    let user = match UserEntity::find()
        .filter(Column::Email.eq(email))
        .one(&txn)
        .await
    {
        Ok(Some(user)) => user,
        Ok(None) => return Response::warn("用户不存在"),
        Err(err) => return Response::error(format!("查询用户失败: {err}")),
    };

    // 在事务中更新用户密码
    let mut user_active: ActiveModel = user.into();
    user_active.password = Set(hashed);

    match user_active.update(&txn).await {
        Ok(_) => {}
        Err(err) => return Response::error(format!("更新密码失败: {err}")),
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(format!("提交事务失败: {err}"));
    }

    Response::success((), "密码重置成功")
}
