use crate::core::env::env;
use crate::models::picture::{ActiveModel, PictureVO, PictureWithUser};
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

static PICTURE_UPLOAD_DIRECTORY: OnceLock<String> = OnceLock::new();
static PICTURE_BASE_PATH: OnceLock<String> = OnceLock::new();

pub struct PictureService;

impl PictureService {
    /// 上传图片服务 - 处理文件上传和数据库记录创建
    pub async fn create_picture(
        state: Arc<AppState>,
        user_id: i64,
        mut multipart: Multipart,
    ) -> Result<()> {
        // 获取环境变量中的上传目录配置
        let picture_upload_directory =
            PICTURE_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_PICTURE_UPLOAD_DIRECTORY"));

        // 确保上传目录存在
        fs::create_dir_all(&picture_upload_directory)
            .await
            .map_err(|err| anyhow!("ERROR:创建上传目录失败: {err}"))?;

        let mut picture_data: Option<Vec<u8>> = None;
        let mut picture_filename: Option<String> = None;

        // 处理所有multipart字段
        while let Ok(Some(field)) = multipart.next_field().await {
            let field_name = field.name().unwrap_or("");

            if field_name == "picture" {
                picture_filename = Some(field.file_name().unwrap().to_string());
                picture_data = Some(field.bytes().await?.to_vec());
            }
        }

        let data = match picture_data {
            Some(data) => data,
            None => {
                return Err(anyhow!(
                    "WARN:未找到图片文件, 请在表单中添加名为picture的文件字段"
                ));
            }
        };
        let filename = validate_option_field!(picture_filename, "文件名");

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
        let file_path = format!("{picture_upload_directory}/{unique_filename}");

        // 检查文件大小（限制为10MB）
        const MAX_FILE_SIZE: usize = 10 * 1024 * 1024; // 10MB
        if data.len() > MAX_FILE_SIZE {
            return Err(anyhow!("WARN:文件大小不能超过10MB"));
        }

        // 保存文件到本地文件系统
        let mut file = fs::File::create(&file_path).await?;
        file.write_all(&data).await?;
        file.sync_all().await?;

        // 构建图片URL（使用环境变量配置的基础路径）
        let picture_base_path = PICTURE_BASE_PATH.get_or_init(|| env("WEBSITE_PICTURE_BASE_PATH"));
        let picture_url = format!("{picture_base_path}/{unique_filename}");

        // 保存到数据库
        let postgres = &state.postgres;
        let picture_id = format!("picture-{}", Uuid::new_v4());
        let now = chrono::Utc::now();
        let picture_active = ActiveModel {
            picture_id: Set(picture_id),
            picture_url: Set(picture_url),
            created_at: Set(now),
            created_by: Set(user_id),
            updated_at: Set(now),
            updated_by: Set(user_id),
            ..Default::default()
        };

        picture_active.insert(postgres).await?;

        Ok(())
    }

    /// 查询图片列表 - 只能查询自己的或者目标权限小于自己的，联表查询用户信息，按创建时间倒序排列
    pub async fn read_picture(
        state: Arc<AppState>,
        user_id: i64,
        user_permission: i16,
    ) -> Result<Vec<PictureVO>> {
        let postgres = &state.postgres;

        // 缓存未命中，从数据库查询
        // 构建基础查询，联表查询用户信息，并添加权限过滤
        let query = crate::models::picture::Entity::find()
            .join(
                JoinType::InnerJoin,
                crate::models::picture::Relation::User.def(),
            )
            // 权限过滤：只能查看自己的图片或者创建者权限小于自己的图片
            .filter(
                sea_orm::Condition::any()
                    .add(crate::models::picture::Column::CreatedBy.eq(user_id))
                    .add(crate::models::user::Column::Permission.lt(user_permission)),
            )
            .select_only()
            // 选择图片信息字段
            .column_as(crate::models::picture::Column::PictureId, "picture_id")
            .column_as(crate::models::picture::Column::PictureUrl, "picture_url")
            .column_as(crate::models::picture::Column::CreatedAt, "created_at")
            .column_as(crate::models::picture::Column::UpdatedAt, "updated_at")
            // 选择用户信息字段
            .column_as(crate::models::user::Column::Id, "user_id")
            .column_as(crate::models::user::Column::AvatarUrl, "user_avatar_url")
            .column_as(crate::models::user::Column::Username, "user_username")
            .column_as(crate::models::user::Column::Email, "user_email")
            .column_as(crate::models::user::Column::Permission, "user_permission")
            // 按创建时间倒序排列
            .order_by_desc(crate::models::picture::Column::CreatedAt);

        let pictures = query
            .into_model::<PictureWithUser>()
            .all(postgres)
            .await?
            .into_iter()
            .map(|item| item.into())
            .collect::<Vec<PictureVO>>();

        Ok(pictures)
    }

    /// 删除图片服务 - 根据 picture_id 删除图片记录和文件
    pub async fn delete_picture(
        state: Arc<AppState>,
        picture_id: String,
        user_id: i64,
        user_permission: i16,
    ) -> Result<()> {
        let postgres = &state.postgres;

        // 开始事务
        let txn = postgres.begin().await?;

        // 先查询图片是否存在，同时联表查询创建者的权限信息
        let (picture, user) = match crate::models::picture::Entity::find()
            .find_also_related(crate::models::user::Entity)
            .filter(crate::models::picture::Column::PictureId.eq(picture_id.clone()))
            .one(&txn)
            .await?
        {
            Some((picture, Some(user))) => (picture, user),
            Some((_, None)) => return Err(anyhow!("WARN:图片创建者不存在: {}", picture_id)),
            None => return Err(anyhow!("WARN:图片不存在: {}", picture_id)),
        };

        // 权限验证：如果不是创建者本人，且当前用户权限小于等于创建者权限，则拒绝操作
        if picture.created_by != user_id && user_permission <= user.permission {
            return Err(anyhow!("WARN:权限不足，只能删除自己上传的图片"));
        }

        // 删除数据库记录
        crate::models::picture::Entity::delete_by_id(picture.id)
            .exec(&txn)
            .await?;

        // 提交事务
        txn.commit().await?;

        // 删除文件系统中的图片文件（在事务提交成功后）
        let picture_upload_directory =
            PICTURE_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_PICTURE_UPLOAD_DIRECTORY"));
        let picture_base_path = PICTURE_BASE_PATH.get_or_init(|| env("WEBSITE_PICTURE_BASE_PATH"));

        // 从 picture_url 中提取文件名
        if let Some(filename) = picture
            .picture_url
            .strip_prefix(&format!("{picture_base_path}/"))
        {
            // 尝试删除文件，如果文件不存在也不报错
            if let Err(err) =
                fs::remove_file(&format!("{picture_upload_directory}/{filename}")).await
            {
                tracing::error!("删除图片文件失败 {filename}: {err}");
            }
        }

        Ok(())
    }
}
