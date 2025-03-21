use crate::AppState;
use crate::core::env::env;
use crate::core::jwt::{UserCredentials, generate_jwt, parse_jwt, verify_jwt};
use crate::core::mail::{generate_random_code, is_valid_email, send_verification_email};
use crate::models::response::Response;
use crate::models::user::{User, UserDTO};
use axum::http::HeaderMap;
use axum::{Extension, Json};
use bcrypt::{hash, verify};
use chrono::Local;
use deadpool_redis::redis::AsyncCommands;
use serde_json::Value;
use std::sync::{Arc, OnceLock};

pub async fn verification_code(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let mut redis = match state.redis_pool.get().await {
        Ok(redis) => redis,
        Err(err) => return Response::error("获取 Redis 连接失败", err),
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
        Err(err) => return Response::error("查询缓存失败", err),
    }

    let code: u32 = generate_random_code();
    match send_verification_email(&state.mailer, email.to_owned(), code.to_string()).await {
        Ok(_) => {}
        Err(err) => return Response::error("发送验证码失败", err),
    }

    match redis
        .set_ex::<&str, u32, bool>(email, code.to_owned(), 300)
        .await
    {
        Ok(_) => Response::success((), "验证码发送成功"),
        Err(err) => Response::error("验证码存入缓存失败", err),
    }
}

static DEFAULT_AVATAR: OnceLock<String> = OnceLock::new();

pub async fn register(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };
    let mut redis = match state.redis_pool.get().await {
        Ok(redis) => redis,
        Err(err) => return Response::error("获取 Redis 连接失败", err),
    };

    let username = match form.get("username").and_then(|v| v.as_str()) {
        Some(username) => username,
        None => return Response::warn("用户名字段缺失"),
    };
    let email = match form.get("email").and_then(|v| v.as_str()) {
        Some(email) => email,
        None => return Response::warn("邮箱字段缺失"),
    };
    let password = match form.get("password").and_then(|v| v.as_str()) {
        Some(password) => password,
        None => return Response::warn("密码字段缺失"),
    };

    let code = match form.get("code").and_then(|v| v.as_str()) {
        Some(code) => code,
        None => return Response::warn("验证码字段缺失"),
    };

    if code
        != match redis.get::<&str, u32>(email).await {
            Ok(code) => code.to_string(),
            Err(_) => return Response::warn("缓存中未查询到验证码"),
        }
    {
        return Response::warn("验证码错误");
    }

    let hashed = match hash(password, 4) {
        Ok(hashed) => hashed,
        Err(err) => return Response::error("密码哈希失败", err),
    };

    let avatar = DEFAULT_AVATAR.get_or_init(|| env("WEBSITE_USER_DEFAULT_AVATAR"));

    match postgres
        .execute(
            "INSERT INTO users (avatar, username, email, password) VALUES ($1, $2, $3, $4)",
            &[&avatar, &username, &email, &hashed],
        )
        .await
    {
        Ok(_) => Response::success((), "注册成功"),
        Err(err) => {
            if err.to_string().contains("unique constraint") {
                if err.to_string().contains("username") {
                    return Response::warn("用户名已被使用");
                } else if err.to_string().contains("email") {
                    return Response::warn("邮箱已被注册");
                }
            }
            Response::error("用户注册失败", err)
        }
    }
}

pub async fn login(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<UserDTO> {
    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };

    let email = match form.get("email").and_then(|v| v.as_str()) {
        Some(email) => email,
        None => return Response::warn("邮箱字段缺失"),
    };
    let password = match form.get("password").and_then(|v| v.as_str()) {
        Some(password) => password,
        None => return Response::warn("密码字段缺失"),
    };

    let row = match postgres
        .query_opt(
            "SELECT id, avatar, username, email, password, permission FROM users WHERE email = $1",
            &[&email],
        )
        .await
    {
        Ok(Some(row)) => row,
        Ok(None) => return Response::warn("用户不存在"),
        Err(err) => return Response::error("查询用户失败", err),
    };

    let hashed = row.get::<&str, &str>("password");
    if !verify(password, hashed)
        .map_err(|err| Response::<String>::error("密码验证失败", err))
        .unwrap()
    {
        return Response::warn("邮箱或密码错误");
    }
    let id = row.get::<&str, i64>("id");
    let avatar = row.get::<&str, &str>("avatar").to_owned();
    let username = row.get::<&str, &str>("username").to_owned();
    let permission = row.get::<&str, i32>("permission");

    let user = UserCredentials {
        avatar: avatar.to_owned(),
        username: username.to_owned(),
        email: email.to_owned(),
        permission,
    };

    let token = match generate_jwt(row.get::<&str, i64>("id"), user) {
        Ok(token) => token,
        Err(err) => return Response::error("JWT 创建失败", err),
    };
    let response = UserDTO {
        user: User {
            id,
            avatar,
            username,
            email: email.to_owned(),
            permission,
        },
        token,
    };
    Response::success(response, "登录成功")
}

pub async fn token_login(headers: HeaderMap) -> Response<UserDTO> {
    let token = match parse_jwt(headers) {
        Some(token) => token,
        None => return Response::warn("JWT 不存在"),
    };

    let claims = match verify_jwt(token.as_str()) {
        Ok(claims) => claims,
        Err(err) => return Response::error("JWT 解析失败", err),
    };

    if Local::now().timestamp() > claims.exp {
        return Response::warn("JWT 已过期");
    }

    let response = UserDTO {
        user: User {
            id: claims.sub,
            avatar: claims.user.avatar,
            username: claims.user.username,
            email: claims.user.email,
            permission: claims.user.permission,
        },
        token,
    };
    Response::success(response, "登录成功")
}

pub async fn reset_password(
    Extension(state): Extension<Arc<AppState>>,
    Json(form): Json<Value>,
) -> Response<()> {
    let postgres = match state.postgres_pool.get().await {
        Ok(postgres) => postgres,
        Err(err) => return Response::error("获取 Postgres 连接失败", err),
    };
    let mut redis = match state.redis_pool.get().await {
        Ok(redis) => redis,
        Err(err) => return Response::error("获取 Redis 连接失败", err),
    };
    let email = match form.get("email").and_then(|v| v.as_str()) {
        Some(email) => email,
        None => return Response::warn("邮箱字段缺失"),
    };
    let password = match form.get("password").and_then(|v| v.as_str()) {
        Some(password) => password,
        None => return Response::warn("密码字段缺失"),
    };

    if match form.get("code").and_then(|v| v.as_str()) {
        Some(code) => code,
        None => return Response::warn("验证码字段缺失"),
    } != match redis.get::<&str, u32>(email).await {
        Ok(code) => code.to_string(),
        Err(_) => return Response::warn("缓存中未查询到验证码"),
    } {
        return Response::warn("验证码错误");
    }

    let hashed = match hash(password, 4) {
        Ok(hashed) => hashed,
        Err(err) => return Response::error("密码哈希失败", err),
    };

    match postgres
        .execute(
            "UPDATE users SET password = $1 WHERE email = $2",
            &[&hashed, &email],
        )
        .await
    {
        Ok(_) => Response::success((), "修改密码成功"),
        Err(err) => Response::error("修改密码失败", err),
    }
}
