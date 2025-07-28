use crate::AppState;
use crate::core::env::env;
use anyhow::Result;
use deadpool_redis::redis::AsyncCommands;
use deadpool_redis::{Config, Pool, PoolConfig, Runtime};
use serde::Serialize;
use std::sync::Arc;

pub fn establish_redis_connection() -> Pool {
    let url = format!(
        "redis://{}:{}@{}:{}/",
        env("REDIS_USERNAME"),
        env("REDIS_PASSWORD"),
        env("REDIS_HOST"),
        env("REDIS_PORT")
    );

    // 创建 Redis 配置
    let mut cfg = Config::from_url(url.as_str());

    // 配置连接池参数以提高并发性能
    cfg.pool = Some(PoolConfig {
        max_size: 50,
        ..Default::default()
    });

    cfg.create_pool(Some(Runtime::Tokio1))
        .unwrap_or_else(|err| {
            tracing::error!("Failed to create Redis connection pool: {}", err);
            std::process::exit(1)
        })
}

/// 设置缓存 - 通用缓存函数
///
/// # 参数
/// - `state`: 应用状态，包含Redis连接池
/// - `key`: 缓存键
/// - `value`: 要缓存的值（必须实现Serialize trait）
/// - `expire_seconds`: 过期时间（秒），如果为None则不设置过期时间
///
/// # 返回值
/// - `Ok(())`: 始终返回成功（错误会被内部处理）
pub async fn set_cache<T: Serialize>(
    state: Arc<AppState>,
    key: &str,
    value: &T,
    expire_seconds: Option<u64>,
) -> Result<()> {
    // 获取Redis连接，如果失败则记录错误并返回
    let mut redis = match state.redis.get().await {
        Ok(redis) => redis,
        Err(err) => {
            tracing::error!("获取Redis连接失败: {err}");
            return Ok(());
        }
    };

    // 将值序列化为JSON字符串，如果失败则记录错误并返回
    let serialized_data = match serde_json::to_string(value) {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("缓存序列化失败: key={key}, error={err}");
            return Ok(());
        }
    };

    // 根据是否设置过期时间选择不同的Redis命令
    match expire_seconds {
        Some(seconds) => {
            if let Err(err) = redis
                .set_ex::<&str, String, ()>(key, serialized_data, seconds)
                .await
            {
                tracing::error!("设置缓存失败: key={key}, error={err}");
            }
        }
        None => {
            if let Err(err) = redis.set::<&str, String, ()>(key, serialized_data).await {
                tracing::error!("设置缓存失败: key={key}, error={err}");
            }
        }
    }

    Ok(())
}

/// 清除缓存 - 通用缓存清除函数
///
/// # 参数
/// - `state`: 应用状态，包含Redis连接池
/// - `key`: 要清除的缓存键
///
/// # 返回值
/// - `Ok(())`: 始终返回成功（错误会被内部处理）
pub async fn clear_cache(state: Arc<AppState>, key: &str) -> Result<()> {
    let mut redis = match state.redis.get().await {
        Ok(redis) => redis,
        Err(err) => {
            tracing::error!("获取Redis连接失败: {err}");
            return Ok(());
        }
    };

    // 尝试删除缓存键，如果失败则记录错误并返回
    match redis.del::<&str, u32>(key).await {
        Ok(_) => Ok(()),
        Err(err) => {
            tracing::error!("清除缓存失败: key={key}, error={err}");
            Ok(())
        }
    }
}

/// 获取缓存 - 通用缓存获取函数
///
/// # 参数
/// - `state`: 应用状态，包含Redis连接池
/// - `key`: 缓存键
///
/// # 返回值
/// - `Ok(Some(T))`: 缓存命中，返回反序列化后的值
/// - `Ok(None)`: 缓存未命中、反序列化失败或Redis操作失败
pub async fn get_cache<T>(state: Arc<AppState>, key: &str) -> Result<Option<T>>
where
    T: for<'de> serde::Deserialize<'de>,
{
    let mut redis = match state.redis.get().await {
        Ok(redis) => redis,
        Err(err) => {
            tracing::error!("获取Redis连接失败: {err}");
            return Ok(None);
        }
    };

    // 尝试从Redis获取缓存数据，如果失败则记录错误并返回None
    let cached_data: Option<String> = match redis.get(key).await {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("获取缓存失败: key={key}, error={err}");
            return Ok(None);
        }
    };

    match cached_data {
        Some(data) => {
            // 尝试反序列化数据
            match serde_json::from_str::<T>(&data) {
                Ok(value) => Ok(Some(value)),
                Err(err) => {
                    tracing::error!("缓存反序列化失败: key={key}, error={err}");
                    Ok(None)
                }
            }
        }
        None => Ok(None),
    }
}
