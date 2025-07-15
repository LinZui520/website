use crate::AppState;
use crate::core::env::env;
use crate::core::jwt::extract_permissions_from_headers;
use crate::models::photo::{ActiveModel, PhotoDTO, PhotoWithRelations, Relation};
use crate::models::response::Response;
use crate::models::user::{Column as UserColumn, Entity as UserEntity, Permission};
use axum::extract::Path as PathExtract;
use axum::http::HeaderMap;
use axum::{Extension, extract::Multipart};
use sea_orm::{
    ActiveModelTrait, EntityTrait, JoinType, QueryOrder, QuerySelect, RelationTrait, Set,
    TransactionTrait,
};
use std::path::Path;
use std::sync::{Arc, OnceLock};
use tokio::fs;
use tokio::io::AsyncWriteExt;

static PHOTO_UPLOAD_DIRECTORY: OnceLock<String> = OnceLock::new();
static PHOTO_BASE_PATH: OnceLock<String> = OnceLock::new();

/// 上传照片处理函数
///
/// 接受multipart/form-data格式的照片文件，保存到本地文件系统
/// 并在数据库中记录照片信息，包括描述和位置信息
///
/// 表单字段：
/// - photo: 照片文件（必需）
/// - location: 拍摄地点（必需）
/// - description: 照片描述（可选）
pub async fn upload_photo(
    headers: HeaderMap,
    Extension(state): Extension<Arc<AppState>>,
    mut multipart: Multipart,
) -> Response<()> {
    // 权限验证：需要Admin及以上权限才能上传照片
    let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
        Some(claims) => claims,
        None => return Response::warn("权限不足"),
    };

    let postgres = &state.postgres;

    // 获取环境变量中的上传目录配置
    let photo_upload_directory =
        PHOTO_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_PHOTO_UPLOAD_DIRECTORY"));

    // 确保上传目录存在
    if let Err(err) = fs::create_dir_all(&photo_upload_directory).await {
        return Response::error(format!("创建上传目录失败: {err}"));
    }

    let mut photo_data = None;
    let mut photo_filename = None;
    let mut description = None;
    let mut location = None;

    // 处理所有multipart字段
    while let Ok(Some(field)) = multipart.next_field().await {
        let field_name = field.name().unwrap_or("").to_string();

        match field_name.as_str() {
            "photo" => {
                // 处理文件字段
                photo_filename = field.file_name().map(|s| s.to_string());
                match field.bytes().await {
                    Ok(data) => photo_data = Some(data),
                    Err(err) => return Response::error(format!("读取文件数据失败: {err}")),
                }
            }
            "description" => {
                if let Ok(desc) = field.text().await {
                    if !desc.trim().is_empty() {
                        description = Some(desc);
                    }
                }
            }
            "location" => {
                if let Ok(loc) = field.text().await {
                    if !loc.trim().is_empty() {
                        location = Some(loc);
                    }
                }
            }
            _ => {
                // 忽略其他字段
            }
        }
    }

    // 检查必需字段
    let data = match photo_data {
        Some(data) => data,
        None => return Response::warn("未找到照片文件，请在表单中添加名为photo的文件字段"),
    };

    let file_name = match photo_filename {
        Some(name) => name,
        None => return Response::warn("未提供文件名"),
    };

    let location = match location {
        Some(loc) => loc,
        None => return Response::warn("拍摄地点不能为空，请提供location字段"),
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
    let file_path = format!("{photo_upload_directory}/{unique_filename}");

    // 检查文件大小（限制为10MB）
    const MAX_FILE_SIZE: usize = 10 * 1024 * 1024; // 10MB
    if data.len() > MAX_FILE_SIZE {
        return Response::warn("文件大小不能超过10MB");
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

    // 构建照片URL（使用环境变量配置的基础路径）
    let photo_base_path = PHOTO_BASE_PATH.get_or_init(|| env("WEBSITE_PHOTO_BASE_PATH"));
    let photo_url = format!("{photo_base_path}/{unique_filename}");

    // 在数据库中保存照片记录
    let photo_active = ActiveModel {
        author: Set(claims.sub),
        filename: Set(unique_filename.to_owned()),
        url: Set(photo_url.to_owned()),
        description: Set(description),
        location: Set(location),
        created_at: Set(Some(chrono::Utc::now())),
        ..Default::default()
    };

    // 插入数据库
    match photo_active.insert(postgres).await {
        Ok(model) => model,
        Err(err) => {
            // 如果数据库插入失败，删除已保存的文件
            let _ = fs::remove_file(&file_path).await;
            return Response::error(format!("保存照片记录失败: {err}"));
        }
    };

    // 返回成功响应
    Response::success((), "照片上传成功")
}

/// 获取照片列表
pub async fn list_photos(Extension(state): Extension<Arc<AppState>>) -> Response<Vec<PhotoDTO>> {
    // let claims = match extract_permissions_from_headers(headers, Permission::Admin) {
    //     Some(claims) => claims,
    //     None => return Response::warn("权限不足"),
    // };

    let postgres = &state.postgres;

    // 构建基础查询，联表查询用户信息
    let query = crate::models::photo::Entity::find()
        .join(JoinType::InnerJoin, Relation::Author.def())
        .column_as(UserColumn::Id, "author_id")
        .column_as(UserColumn::Avatar, "author_avatar")
        .column_as(UserColumn::Username, "author_username")
        .column_as(UserColumn::Email, "author_email")
        .column_as(UserColumn::Permission, "author_permission")
        .order_by_desc(crate::models::photo::Column::CreatedAt);

    // 根据权限添加过滤条件
    // if claims.user.permission == 1 {
    //     // Admin 权限：只显示自己上传的照片
    //     query = query.filter(crate::models::photo::Column::Author.eq(claims.sub));
    // } else if claims.user.permission >= 2 {
    //     // Master+ 权限：显示所有照片
    // }

    // 执行查询
    match query.into_model::<PhotoWithRelations>().all(postgres).await {
        Ok(data) => Response::success(
            data.into_iter().map(|item| item.into_photo_dto()).collect(),
            "查询成功",
        ),
        Err(err) => Response::error(format!("查询照片列表失败: {err}")),
    }
}

/// 删除照片
///
/// 权限控制：
/// - 需要Admin及以上权限
/// - 只有照片作者本人或权限更高的用户才能删除
pub async fn delete_photo(
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

    // 查询照片及其作者信息
    let (photo, author) = match crate::models::photo::Entity::find_by_id(id)
        .find_also_related(UserEntity)
        .one(&txn)
        .await
    {
        Ok(Some((photo, Some(author)))) => (photo, author),
        Ok(Some((_, None))) => return Response::warn("照片作者信息异常"),
        Ok(None) => return Response::warn("照片不存在"),
        Err(err) => return Response::error(format!("查询照片失败: {err}")),
    };

    // 权限检查：只有作者本人或权限更高的用户才能删除
    if claims.user.permission <= author.permission && claims.sub != author.id {
        return Response::warn("权限不足，无法删除该照片");
    }

    // 获取照片文件路径，准备删除本地文件
    let photo_upload_directory =
        PHOTO_UPLOAD_DIRECTORY.get_or_init(|| env("WEBSITE_PHOTO_UPLOAD_DIRECTORY"));
    let file_path = format!("{photo_upload_directory}/{}", photo.filename);

    // 删除数据库记录
    match crate::models::photo::Entity::delete_by_id(id)
        .exec(&txn)
        .await
    {
        Ok(_) => {}
        Err(err) => return Response::error(format!("删除照片记录失败: {err}")),
    }

    // 提交事务
    if let Err(err) = txn.commit().await {
        return Response::error(format!("提交事务失败: {err}"));
    }

    // 删除本地文件（即使失败也不影响数据库操作）
    if let Err(err) = tokio::fs::remove_file(&file_path).await {
        tracing::warn!("删除照片文件失败: {file_path} - {err}");
    }

    Response::success((), "删除照片成功")
}
