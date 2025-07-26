use crate::core::env::env;
use crate::core::jwt::{UserCredentials, generate_jwt, parse_jwt, verify_jwt};
use crate::core::mail::{generate_random_code, is_valid_email, send_verification_email};
use crate::models::auth::AuthVO;
use crate::models::user::{ActiveModel, Column, Entity as UserEntity, UserDTO, UserVO};
use crate::{AppState, validate_option_field};
use anyhow::{Result, anyhow};
use axum::extract::Multipart;
use axum::http::HeaderMap;
use bcrypt::{hash, verify};
use chrono::Local;
use deadpool_redis::redis::AsyncCommands;
use sea_orm::QueryFilter;
use sea_orm::{ActiveModelTrait, EntityTrait, Set};
use sea_orm::{ColumnTrait, TransactionTrait};
use std::path::Path;
use std::sync::{Arc, OnceLock};
use tokio::fs;
use tokio::io::AsyncWriteExt;

pub struct AuthService;

static DEFAULT_AVATAR: OnceLock<String> = OnceLock::new();
static AVATAR_UPLOAD_DIRECTORY: OnceLock<String> = OnceLock::new();
static AVATAR_BASE_PATH: OnceLock<String> = OnceLock::new();

impl AuthService {
    /// 发送验证码服务
    pub async fn verification_code(state: Arc<AppState>, user_dto: UserDTO) -> Result<()> {
        // 获取 Redis 连接池
        let mut redis = state.redis.get().await?;

        let email = validate_option_field!(user_dto.email, "邮箱");

        // 验证邮箱格式
        if !is_valid_email(&email) {
            return Err(anyhow!("WARN:邮箱格式不正确"));
        }

        // 检查验证码是否已存在（防止频繁发送）
        if redis.exists::<&str, bool>(&email).await? {
            let ttl = redis.ttl(&email).await.unwrap_or(0);
            return Err(anyhow!("WARN:验证码已发送，请{ttl}秒后再试"));
        }

        // 生成6位数验证码
        let code: String = generate_random_code().to_string();

        // 发送验证邮件
        send_verification_email(&state.mailer, email.clone(), code.clone()).await?;

        // 保存验证码到Redis，有效期5分钟
        redis
            .set_ex::<&str, String, bool>(&email, code, 300)
            .await?;

        Ok(())
    }

    /// 用户注册服务
    pub async fn register(state: Arc<AppState>, user_dto: UserDTO) -> Result<()> {
        let postgres = &state.postgres;
        let mut redis = state.redis.get().await?;

        // 验证必需字段
        let username = validate_option_field!(user_dto.username, "用户名");
        let email = validate_option_field!(user_dto.email, "邮箱");
        let password = validate_option_field!(user_dto.password, "密码");
        let code = validate_option_field!(user_dto.verification_code, "验证码");

        // 验证验证码
        let stored_code: String = redis
            .get(&email)
            .await
            .map_err(|_| anyhow!("WARN:未查询到验证码"))?;

        if code != stored_code {
            return Err(anyhow!("WARN:验证码错误"));
        }

        // 密码哈希
        let password_hashed = hash(&password, 4)?;

        // 获取默认头像
        let avatar_url = DEFAULT_AVATAR
            .get_or_init(|| env("WEBSITE_USER_DEFAULT_AVATAR"))
            .to_string();
        let now = chrono::Utc::now();

        // 创建用户记录
        let user = ActiveModel {
            avatar_url: Set(avatar_url),
            username: Set(username),
            email: Set(email.clone()),
            password_hashed: Set(password_hashed),
            permission: Set(0),
            created_at: Set(now),
            created_by: Set(0), // 系统创建
            updated_at: Set(now),
            updated_by: Set(0), // 系统创建
            ..Default::default()
        };

        // 插入数据库
        user.insert(postgres).await?;

        // 删除已使用的验证码
        let _: () = redis.del(&email).await?;

        Ok(())
    }

    /// 用户登录服务
    pub async fn login(state: Arc<AppState>, user_dto: UserDTO) -> Result<AuthVO> {
        let postgres = &state.postgres;

        let email = validate_option_field!(user_dto.email, "邮箱");
        let password = validate_option_field!(user_dto.password, "密码");

        // 根据邮箱查找用户
        let user = match UserEntity::find()
            .filter(Column::Email.eq(&email))
            .one(postgres)
            .await
        {
            Ok(Some(user)) => user,
            Ok(None) => return Err(anyhow!("WARN:邮箱或密码错误")),
            Err(err) => return Err(anyhow!("ERROR:查询用户失败: {err}")),
        };

        // 验证密码
        if !verify(&password, &user.password_hashed).unwrap_or(false) {
            return Err(anyhow!("WARN:邮箱或密码错误"));
        }

        // 检查用户是否被封禁
        if user.permission < 0 {
            return Err(anyhow!("WARN:用户已被封禁"));
        }

        // 创建 JWT 用户凭证
        let user_credentials = UserCredentials {
            avatar: user.avatar_url.clone(),
            username: user.username.clone(),
            email: user.email.clone(),
            permission: user.permission,
        };

        // 生成 JWT token
        let token = generate_jwt(user.id, user_credentials)?;

        Ok(AuthVO::new(UserVO::from(user), token))
    }

    /// Token 登录服务
    pub async fn jwt_login(state: Arc<AppState>, headers: HeaderMap) -> Result<AuthVO> {
        let postgres = &state.postgres;

        // 解析 JWT token
        let token = match parse_jwt(headers) {
            Some(token) => token,
            None => return Err(anyhow!("WARN:JWT 不存在")),
        };

        // 验证 JWT token
        let claims = verify_jwt(token.as_str())?;

        // 检查 JWT 是否过期
        if Local::now().timestamp() > claims.exp {
            return Err(anyhow!("WARN:JWT 已过期"));
        }

        // 从数据库查询最新的用户信息
        let user = match UserEntity::find_by_id(claims.sub).one(postgres).await {
            Ok(Some(user)) => user,
            Ok(None) => return Err(anyhow!("WARN:用户不存在")),
            Err(err) => return Err(anyhow!("ERROR:查询用户失败: {err}")),
        };

        // 检查用户是否被封禁
        if user.permission < 0 {
            return Err(anyhow!("WARN:用户已被封禁"));
        }

        Ok(AuthVO::new(UserVO::from(user), token))
    }

    /// 重置密码服务
    pub async fn reset_password(state: Arc<AppState>, user_dto: UserDTO) -> Result<()> {
        let postgres = &state.postgres;
        let mut redis = state.redis.get().await?;

        // 验证必需字段
        let email = validate_option_field!(user_dto.email, "邮箱");
        let password = validate_option_field!(user_dto.password, "密码");
        let code = validate_option_field!(user_dto.verification_code, "验证码");

        // 验证验证码
        let stored_code: String = redis
            .get(&email)
            .await
            .map_err(|_| anyhow!("WARN:未查询到验证码"))?;

        if code != stored_code {
            return Err(anyhow!("WARN:验证码错误"));
        }

        // 密码哈希
        let password_hashed = hash(&password, 4)?;

        // 查找用户
        let user = match UserEntity::find()
            .filter(Column::Email.eq(&email))
            .one(postgres)
            .await
        {
            Ok(Some(user)) => user,
            Ok(None) => return Err(anyhow!("WARN:用户不存在")),
            Err(err) => return Err(anyhow!("ERROR:查询用户失败: {err}")),
        };

        // 检查用户是否被封禁
        if user.permission < 0 {
            return Err(anyhow!("WARN:用户已被封禁，无法重置密码"));
        }

        // 更新用户密码
        let mut user_active: ActiveModel = user.into();
        user_active.password_hashed = Set(password_hashed);
        user_active.updated_at = Set(chrono::Utc::now());

        user_active.update(postgres).await?;

        // 删除已使用的验证码
        let _: () = redis.del(&email).await?;

        Ok(())
    }

    /// 更新用户头像服务
    pub async fn upload_avatar(
        state: Arc<AppState>,
        mut multipart: Multipart,
        user_id: i64,
    ) -> Result<UserVO> {
        let postgres = &state.postgres;

        // 获取环境变量中的头像上传目录配置
        let avatar_upload_directory =
            AVATAR_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_AVATAR_UPLOAD_DIRECTORY"));

        // 确保上传目录存在
        fs::create_dir_all(&avatar_upload_directory).await?;

        // 寻找名为"avatar"的字段（只处理第一个）
        let field = loop {
            match multipart.next_field().await? {
                Some(field) => {
                    if field.name().unwrap_or("") == "avatar" {
                        break field;
                    }
                }
                None => {
                    return Err(anyhow!(
                        "WARN:未找到头像文件，请在表单中添加名为avatar的文件字段"
                    ));
                }
            }
        };

        // 获取原始文件名
        let file_name = match field.file_name() {
            Some(name) => name.to_string(),
            None => return Err(anyhow!("WARN:未提供文件名")),
        };

        // 验证文件扩展名
        let extension = Path::new(&file_name)
            .extension()
            .and_then(|s| s.to_str())
            .map(|s| s.to_lowercase());

        let allowed_extensions = ["jpg", "jpeg", "png", "gif", "webp"];
        let extension = match extension {
            Some(ext) if allowed_extensions.contains(&ext.as_str()) => ext,
            _ => {
                return Err(anyhow!(
                    "WARN:不支持的文件格式，仅支持 jpg、jpeg、png、gif、webp"
                ));
            }
        };

        // 生成唯一文件名（使用用户ID和毫秒级时间戳）
        let timestamp = chrono::Utc::now().timestamp_millis();
        let unique_filename = format!("{timestamp}.{extension}");
        let file_path = format!("{avatar_upload_directory}/{unique_filename}");

        // 获取文件数据
        let data = field.bytes().await?;

        // 检查文件大小（限制为5MB）
        const MAX_FILE_SIZE: usize = 5 * 1024 * 1024; // 5MB
        if data.len() > MAX_FILE_SIZE {
            return Err(anyhow!("WARN:头像文件大小不能超过5MB"));
        }

        // 保存文件到本地文件系统
        let mut file = fs::File::create(&file_path).await?;
        file.write_all(&data).await?;
        file.sync_all().await?;

        // 构建头像URL（使用环境变量配置的基础路径）
        let avatar_base_path = AVATAR_BASE_PATH.get_or_init(|| env("WEBSITE_AVATAR_BASE_PATH"));
        let avatar_url = format!("{avatar_base_path}/{unique_filename}");

        // 开启事务
        let txn = postgres.begin().await?;

        // 在事务中查询数据库中用户的当前头像信息
        let current_user = match UserEntity::find_by_id(user_id).one(&txn).await? {
            Some(user) => user,
            None => return Err(anyhow!("WARN:用户不存在")),
        };

        // 在事务中更新用户头像
        let mut user_active: ActiveModel = current_user.clone().into();
        user_active.avatar_url = Set(avatar_url.clone());
        user_active.updated_at = Set(chrono::Utc::now());

        let updated_user = user_active.update(&txn).await?;

        // 提交事务
        txn.commit().await?;

        // 事务提交成功后，删除旧头像文件（如果不是默认头像的话）
        let default_avatar = DEFAULT_AVATAR.get_or_init(|| env("WEBSITE_USER_DEFAULT_AVATAR"));
        if current_user.avatar_url != *default_avatar {
            let old_file_path = format!(
                "{}/{}",
                avatar_upload_directory,
                current_user.avatar_url.split('/').next_back().unwrap()
            );
            let _ = fs::remove_file(old_file_path).await; // 忽略删除错误
        }

        Ok(UserVO::from(updated_user))
    }
}
