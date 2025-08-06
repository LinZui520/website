use crate::core::env::env;
use crate::core::redis::{clear_cache, get_cache, set_cache};
use crate::models::photo::{ActiveModel, PhotoVO, PhotoWithUser};
use crate::{AppState, validate_option_field};
use anyhow::{Result, anyhow};
use axum::extract::Multipart;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, JoinType, QueryFilter, QueryOrder, QuerySelect,
    RelationTrait, Set, TransactionTrait,
};
use std::path::Path;
use std::sync::{Arc, OnceLock};
use tokio::fs;
use tokio::io::AsyncWriteExt;
use uuid::Uuid;

static PHOTO_UPLOAD_DIRECTORY: OnceLock<String> = OnceLock::new();
static PHOTO_BASE_PATH: OnceLock<String> = OnceLock::new();

pub struct PhotoService;

impl PhotoService {
    /// 照片列表缓存键
    pub const CACHE_KEY_LIST: &'static str = "photos:list";

    /// 照片列表缓存过期时间（秒）- 无限缓存，依赖主动清除
    const CACHE_EXPIRE_LIST: Option<u64> = None;

    /// 上传照片服务 - 处理文件上传和数据库记录创建
    pub async fn create_photo(
        state: Arc<AppState>,
        user_id: i64,
        mut multipart: Multipart,
    ) -> Result<()> {
        // 获取环境变量中的上传目录配置
        let photo_upload_directory =
            PHOTO_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_PHOTO_UPLOAD_DIRECTORY"));

        // 确保上传目录存在
        fs::create_dir_all(&photo_upload_directory)
            .await
            .map_err(|err| anyhow!("ERROR:创建上传目录失败: {err}"))?;

        let mut photo_data: Option<Vec<u8>> = None;
        let mut photo_filename: Option<String> = None;
        let mut photo_description: Option<String> = None;
        let mut photo_location: Option<String> = None;

        // 处理所有multipart字段
        while let Ok(Some(field)) = multipart.next_field().await {
            let field_name = field.name().unwrap_or("");

            match field_name {
                "photo" => {
                    photo_filename = Some(field.file_name().unwrap().to_string());
                    photo_data = Some(field.bytes().await?.to_vec());
                }
                "description" => photo_description = Some(field.text().await?.to_string()),
                "location" => photo_location = Some(field.text().await?.trim().to_string()),
                _ => {} // 忽略其他字段
            }
        }

        let data = match photo_data {
            Some(data) => data,
            None => {
                return Err(anyhow!(
                    "WARN:未找到照片文件, 请在表单中添加名为photo的文件字段"
                ));
            }
        };
        let filename = validate_option_field!(photo_filename, "文件名");
        let description = photo_description;
        let location = validate_option_field!(photo_location, "照片拍摄地点");

        // 验证文件扩展名
        let extension = Path::new(&filename)
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

        // 生成唯一文件名（使用毫秒级时间戳）
        let timestamp = chrono::Utc::now().timestamp_millis();
        let unique_filename = format!("{timestamp}.{extension}");
        let file_path = format!("{photo_upload_directory}/{unique_filename}");

        // 检查文件大小（限制为10MB）
        const MAX_FILE_SIZE: usize = 10 * 1024 * 1024; // 10MB
        if data.len() > MAX_FILE_SIZE {
            return Err(anyhow!("WARN:文件大小不能超过10MB"));
        }

        // 保存文件到本地文件系统
        let mut file = fs::File::create(&file_path).await?;
        file.write_all(&data).await?;
        file.sync_all().await?;

        // 构建照片URL（使用环境变量配置的基础路径）
        let photo_base_path = PHOTO_BASE_PATH.get_or_init(|| env("WEBSITE_PHOTO_BASE_PATH"));
        let photo_url = format!("{photo_base_path}/{unique_filename}");

        // 保存到数据库
        let postgres = &state.postgres;
        let photo_id = format!("photo-{}", Uuid::new_v4());
        let now = chrono::Utc::now();
        let photo_active = ActiveModel {
            photo_id: Set(photo_id),
            photo_url: Set(photo_url),
            description: Set(description),
            location: Set(location),
            created_at: Set(now),
            created_by: Set(user_id),
            updated_at: Set(now),
            updated_by: Set(user_id),
            ..Default::default()
        };

        photo_active.insert(postgres).await?;

        // 异步清除照片列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }

    /// 查询所有照片列表 - 联表查询用户信息，按创建时间倒序排列
    pub async fn read_photo(state: Arc<AppState>) -> Result<Vec<PhotoVO>> {
        // 尝试从缓存获取
        if let Some(photos) = get_cache::<Vec<PhotoVO>>(state.clone(), Self::CACHE_KEY_LIST).await?
        {
            return Ok(photos);
        }

        let postgres = &state.postgres;

        // 缓存未命中，从数据库查询
        // 构建基础查询，联表查询用户信息
        let query = crate::models::photo::Entity::find()
            .join(
                JoinType::InnerJoin,
                crate::models::photo::Relation::User.def(),
            )
            .select_only()
            // 选择照片信息字段
            .column_as(crate::models::photo::Column::PhotoId, "photo_id")
            .column_as(crate::models::photo::Column::PhotoUrl, "photo_url")
            .column_as(crate::models::photo::Column::Description, "description")
            .column_as(crate::models::photo::Column::Location, "location")
            .column_as(crate::models::photo::Column::CreatedAt, "created_at")
            .column_as(crate::models::photo::Column::UpdatedAt, "updated_at")
            // 选择用户信息字段
            .column_as(crate::models::user::Column::Id, "user_id")
            .column_as(crate::models::user::Column::AvatarUrl, "user_avatar_url")
            .column_as(crate::models::user::Column::Username, "user_username")
            .column_as(crate::models::user::Column::Email, "user_email")
            .column_as(crate::models::user::Column::Permission, "user_permission")
            // 按创建时间倒序排列
            .order_by_desc(crate::models::photo::Column::CreatedAt);

        let photos = query
            .into_model::<PhotoWithUser>()
            .all(postgres)
            .await?
            .into_iter()
            .map(|item| item.into())
            .collect::<Vec<PhotoVO>>();

        // 异步设置缓存，不阻塞主函数
        let photos_for_cache = photos.clone();
        tokio::spawn(async move {
            set_cache(
                state,
                Self::CACHE_KEY_LIST,
                &photos_for_cache,
                Self::CACHE_EXPIRE_LIST,
            )
            .await
        });

        Ok(photos)
    }

    /// 更新照片服务 - 根据权限控制更新照片描述信息
    /// 权限控制：只能更新权限低于当前用户的照片作者创建的照片，或者自己创建的照片
    pub async fn update_photo(
        state: Arc<AppState>,
        photo_id: String,
        user_id: i64,
        user_permission: i16,
        photo_dto: crate::models::photo::PhotoDTO,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询照片是否存在，同时联表查询创建者的权限信息
        let (photo, user) = match crate::models::photo::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::photo::Column::PhotoId.eq(photo_id.clone()))
            .one(&txn)
            .await?
        {
            Some((photo, Some(user))) => (photo, user),
            Some((_, None)) => return Err(anyhow!("WARN:照片创建者不存在")),
            None => return Err(anyhow!("WARN:照片不存在")),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if photo.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!(
                "WARN:权限不足，只能更新自己创建的照片或权限低于自己的用户创建的照片"
            ));
        }

        // 更新照片记录 - 只更新描述字段
        let mut photo_active: ActiveModel = photo.into();

        if let Some(description) = photo_dto.description {
            photo_active.description = Set(Some(description));
        }

        photo_active.updated_at = Set(chrono::Utc::now());
        photo_active.updated_by = Set(user_id);

        photo_active.update(&txn).await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除照片列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        Ok(())
    }

    /// 删除照片服务 - 根据 photo_id 删除照片记录和文件
    pub async fn delete_photo(
        state: Arc<AppState>,
        photo_id: String,
        user_id: i64,
        user_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询照片是否存在，同时联表查询创建者的权限信息
        let (photo, user) = match crate::models::photo::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::photo::Column::PhotoId.eq(photo_id.clone()))
            .one(&txn)
            .await?
        {
            Some((photo, Some(user))) => (photo, user),
            Some((_, None)) => return Err(anyhow!("WARN:照片创建者不存在: {}", photo_id)),
            None => return Err(anyhow!("WARN:照片不存在: {}", photo_id)),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if photo.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!("WARN:权限不足，只能删除自己上传的照片"));
        }

        // 删除数据库记录
        crate::models::photo::Entity::delete_by_id(photo.id)
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 异步清除照片列表缓存，不阻塞主函数
        tokio::spawn(async move { clear_cache(state.clone(), Self::CACHE_KEY_LIST).await });

        // 删除文件系统中的照片文件（在事务提交成功后）
        let photo_upload_directory =
            PHOTO_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_PHOTO_UPLOAD_DIRECTORY"));
        let photo_base_path = PHOTO_BASE_PATH.get_or_init(|| env("WEBSITE_PHOTO_BASE_PATH"));

        // 从 photo_url 中提取文件名
        if let Some(filename) = photo.photo_url.strip_prefix(&format!("{photo_base_path}/")) {
            // 尝试删除文件，如果文件不存在也不报错
            if let Err(err) = fs::remove_file(&format!("{photo_upload_directory}/{filename}")).await
            {
                tracing::warn!("删除照片文件失败 {filename}: {err}");
            }
        }

        Ok(())
    }
}
