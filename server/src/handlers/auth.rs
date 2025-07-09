use crate::core::env::env;
use crate::core::jwt::{
    UserCredentials, extract_permissions_from_headers, generate_jwt, parse_jwt, verify_jwt,
};
use crate::core::mail::{generate_random_code, is_valid_email, send_verification_email};
use crate::models::response::Response;
use crate::models::user::{ActiveModel, Column, Entity as UserEntity, Permission, User, UserDTO};
use crate::{AppState, validate_field};
use axum::extract::Multipart;
use axum::http::HeaderMap;
use axum::{Extension, Json};
use bcrypt::{hash, verify};
use chrono::Local;
use deadpool_redis::redis::AsyncCommands;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set, TransactionTrait};
use serde_json::Value;
use std::path::Path;
use std::sync::{Arc, OnceLock};
use tokio::fs;
use tokio::io::AsyncWriteExt;

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

static AVATAR_UPLOAD_DIRECTORY: OnceLock<String> = OnceLock::new();
static AVATAR_BASE_PATH: OnceLock<String> = OnceLock::new();

/// 更新用户头像
///
/// 接受multipart/form-data格式的图片文件，保存到环境变量配置的目录
/// 并更新用户头像字段
pub async fn upload_avatar(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    mut multipart: Multipart,
) -> Response<User> {
    // 权限验证：需要User及以上权限（用户只能更新自己的头像）
    let claims = match extract_permissions_from_headers(headers, Permission::User) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 获取环境变量中的头像上传目录配置
    let avatar_upload_directory =
        AVATAR_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_AVATAR_UPLOAD_DIRECTORY"));

    // 确保上传目录存在
    if let Err(err) = fs::create_dir_all(&avatar_upload_directory).await {
        return Response::error(format!("创建上传目录失败: {err}"));
    }

    // 寻找名为"avatar"的字段（只处理第一个）
    let field = loop {
        match multipart.next_field().await {
            Ok(Some(field)) => {
                let field_name = field.name().unwrap_or("");
                if field_name == "avatar" {
                    break field;
                }
            }
            Ok(None) => {
                return Response::warn("未找到头像文件，请在表单中添加名为avatar的文件字段");
            }
            Err(err) => return Response::error(format!("解析multipart表单数据失败: {err}")),
        }
    };

    // 获取原始文件名
    let file_name = match field.file_name() {
        Some(name) => name.to_string(),
        None => return Response::warn("未提供文件名"),
    };

    // 验证文件扩展名
    let extension = Path::new(&file_name)
        .extension()
        .and_then(|s| s.to_str())
        .map(|s| s.to_lowercase());

    let allowed_extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    let extension = match extension {
        Some(ext) if allowed_extensions.contains(&ext.as_str()) => ext,
        _ => return Response::warn("不支持的文件格式，仅支持 jpg、jpeg、png、gif、webp"),
    };

    // 生成唯一文件名（使用用户ID和毫秒级时间戳）
    let timestamp = chrono::Utc::now().timestamp_millis();
    let unique_filename = format!("{timestamp}.{extension}");
    let file_path = format!("{avatar_upload_directory}/{unique_filename}");

    // 获取文件数据
    let data = match field.bytes().await {
        Ok(data) => data,
        Err(err) => return Response::error(format!("读取文件数据失败: {err}")),
    };

    // 检查文件大小（限制为2MB）
    const MAX_FILE_SIZE: usize = 2 * 1024 * 1024; // 2MB
    if data.len() > MAX_FILE_SIZE {
        return Response::warn("头像文件大小不能超过2MB");
    }

    // 保存文件到本地文件系统
    match fs::File::create(&file_path).await {
        Ok(mut file) => {
            if let Err(err) = file.write_all(&data).await {
                return Response::error(format!("写入文件失败: {err}"));
            }
            if let Err(err) = file.sync_all().await {
                return Response::error(format!("同步文件失败: {err}"));
            }
        }
        Err(err) => return Response::error(format!("创建文件失败: {err}")),
    }

    // 构建头像URL（使用环境变量配置的基础路径）
    let avatar_base_path = AVATAR_BASE_PATH.get_or_init(|| env("WEBSITE_AVATAR_BASE_PATH"));
    let avatar_url = format!("{avatar_base_path}/{unique_filename}");

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => {
            // 如果开启事务失败，删除已保存的文件
            let _ = fs::remove_file(&file_path).await;
            return Response::error(format!("开始事务失败: {err}"));
        }
    };

    // 在事务中查询数据库中用户的当前头像信息
    let current_user = match UserEntity::find_by_id(claims.sub).one(&txn).await {
        Ok(Some(user)) => user,
        Ok(None) => {
            let _ = fs::remove_file(&file_path).await;
            return Response::warn("用户不存在");
        }
        Err(err) => {
            let _ = fs::remove_file(&file_path).await;
            return Response::error(format!("查询用户信息失败: {err}"));
        }
    };

    // 在事务中更新用户头像
    let user_active = ActiveModel {
        id: Set(claims.sub),
        avatar: Set(avatar_url.clone()),
        ..Default::default()
    };

    let updated_user = match user_active.update(&txn).await {
        Ok(updated_user) => updated_user,
        Err(err) => {
            // 如果数据库更新失败，删除已保存的文件
            let _ = fs::remove_file(&file_path).await;
            return Response::error(format!("更新用户头像失败: {err}"));
        }
    };

    // 提交事务
    if let Err(err) = txn.commit().await {
        // 如果提交事务失败，删除已保存的文件
        let _ = fs::remove_file(&file_path).await;
        return Response::error(format!("提交事务失败: {err}"));
    }

    // 事务提交成功后，删除旧头像文件（如果不是默认头像的话）
    let default_avatar = DEFAULT_AVATAR.get_or_init(|| env("WEBSITE_USER_DEFAULT_AVATAR"));

    if current_user.avatar != default_avatar.clone() {
        // 尝试从URL中提取文件名并删除旧文件
        if let Some(old_filename) = current_user.avatar.split('/').next_back() {
            let old_file_path = format!("{avatar_upload_directory}/{old_filename}");
            let _ = fs::remove_file(old_file_path).await; // 忽略删除错误
        }
    }

    Response::success(updated_user.into(), "头像更新成功 重新登录生效")
}
