use crate::AppState;
use crate::core::env::env;
use crate::core::jwt::extract_permissions_from_headers;
use crate::models::image::{ActiveModel, ImageDTO, ImageWithRelations, Relation};
use crate::models::response::Response;
use crate::models::user::{Column as UserColumn, Entity as UserEntity, Permission};
use axum::extract::Path as PathExtract;
use axum::http::HeaderMap;
use axum::{Extension, extract::Multipart};
use sea_orm::ColumnTrait;
use sea_orm::QueryFilter;
use sea_orm::{
    ActiveModelTrait, EntityTrait, JoinType, QueryOrder, QuerySelect, RelationTrait, Set,
    TransactionTrait,
};
use std::path::Path;
use std::sync::{Arc, OnceLock};
use tokio::fs;
use tokio::io::AsyncWriteExt;

static IMAGE_UPLOAD_DIRECTORY: OnceLock<String> = OnceLock::new();
static IMAGE_BASE_PATH: OnceLock<String> = OnceLock::new();

/// 上传图片处理函数
///
/// 接受multipart/form-data格式的图片文件，保存到本地文件系统
/// 并在数据库中记录图片信息
pub async fn upload_image(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    mut multipart: Multipart,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能上传图片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 获取环境变量中的上传目录配置
    let image_upload_directory =
        IMAGE_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_IMAGE_UPLOAD_DIRECTORY"));

    // 确保上传目录存在
    if let Err(err) = fs::create_dir_all(&image_upload_directory).await {
        return Response::error(format!("创建上传目录失败: {err}"));
    }

    // 寻找名为"image"的字段（只处理第一个）
    let field = loop {
        match multipart.next_field().await {
            Ok(Some(field)) => {
                let field_name = field.name().unwrap_or("");
                if field_name == "image" {
                    break field;
                }
            }
            Ok(None) => {
                return Response::warn("未找到图片文件，请在表单中添加名为image的文件字段");
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

    // 生成唯一文件名（使用毫秒级时间戳）
    let timestamp = chrono::Utc::now().timestamp_millis();
    let unique_filename = format!("{timestamp}.{extension}");
    let file_path = format!("{image_upload_directory}/{unique_filename}");

    // 获取文件数据
    let data = match field.bytes().await {
        Ok(data) => data,
        Err(err) => return Response::error(format!("读取文件数据失败: {err}")),
    };

    // 检查文件大小（限制为5MB）
    const MAX_FILE_SIZE: usize = 5 * 1024 * 1024; // 5MB
    if data.len() > MAX_FILE_SIZE {
        return Response::warn("文件大小不能超过5MB");
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

    // 构建图片URL（使用环境变量配置的基础路径）
    let image_base_path = IMAGE_BASE_PATH.get_or_init(|| env("WEBSITE_IMAGE_BASE_PATH"));
    let image_url = format!("{image_base_path}/{unique_filename}");

    // 在数据库中保存图片记录
    let image_active = ActiveModel {
        author: Set(claims.sub),
        url: Set(image_url.to_owned()),
        filename: Set(unique_filename.to_owned()),
        created_at: Set(Some(chrono::Utc::now())),
        ..Default::default()
    };

    // 插入数据库
    match image_active.insert(postgres).await {
        Ok(model) => model,
        Err(err) => {
            // 如果数据库插入失败，删除已保存的文件
            let _ = fs::remove_file(&file_path).await;
            return Response::error(format!("保存图片记录失败: {err}"));
        }
    };

    // 返回成功响应
    Response::success((), "图片上传成功")
}
/// 获取图片列表
///
/// 权限控制：
/// - Admin权限(permission == 1)：只能查看自己上传的图片
/// - Master及以上权限(permission >= 2)：可以查看所有图片
pub async fn list_images(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<Vec<ImageDTO>> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 构建基础查询，联表查询用户信息
    let mut query = crate::models::image::Entity::find()
        .join(JoinType::InnerJoin, Relation::Author.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission")
        .order_by_desc(crate::models::image::Column::CreatedAt);

    // 根据权限添加过滤条件
    if claims.user.permission == 1 {
        // Admin 权限：只显示自己上传的图片
        query = query.filter(crate::models::image::Column::Author.eq(claims.sub));
    } else if claims.user.permission >= 2 {
        // Master+ 权限：显示所有图片
    }

    // 执行查询
    match query.into_model::<ImageWithRelations>().all(postgres).await {
        Ok(data) => Response::success(
            data.into_iter().map(|item| item.into_image_dto()).collect(),
            "查询成功",
        ),
        Err(err) => Response::error(format!("查询图片列表失败: {err}")),
    }
}

/// 删除图片
///
/// 权限控制：
/// - 需要Admin及以上权限
/// - 只有图片作者本人或权限更高的用户才能删除
pub async fn delete_image(
    PathExtract(id): PathExtract<i64>,
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
) -> Response<()> {
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 开启事务
    let txn = match postgres.begin().await {
        Ok(txn) => txn,
        Err(err) => return Response::error(format!("开始事务失败: {err}")),
    };

    // 查询图片及其作者信息
    let (image, author) = match crate::models::image::Entity::find_by_id(id)
        .find_also_related(UserEntity)
        .one(&txn)
        .await
    {
        Ok(Some((image, Some(author)))) => (image, author),
        Ok(Some((_, None))) => return Response::warn("图片作者信息异常"),
        Ok(None) => return Response::warn("图片不存在"),
        Err(err) => return Response::error(format!("查询图片失败: {err}")),
    };

    // 权限检查：只有作者本人或权限更高的用户才能删除
    if claims.user.permission <= author.permission && claims.sub != author.id {
        return Response::warn("权限不足，无法删除该图片");
    }

    // 获取图片文件路径，准备删除本地文件
    let image_upload_directory =
        IMAGE_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_IMAGE_UPLOAD_DIRECTORY"));
    let file_path = format!("{image_upload_directory}/{}", image.filename);

    // 删除数据库记录
    match crate::models::image::Entity::delete_by_id(id)
        .exec(&txn)
        .await
    {
        Ok(_) => {}
        Err(err) => return Response::error(format!("删除图片记录失败: {err}")),
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(format!("提交事务失败: {err}"));
    }

    // 删除本地文件（即使失败也不影响数据库操作）
    if let Err(err) = tokio::fs::remove_file(&file_path).await {
        tracing::warn!("删除图片文件失败: {file_path} - {err}");
    }

    Response::success((), "删除图片成功")
}
