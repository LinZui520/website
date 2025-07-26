/// Option<String> 字段验证宏
///
/// 这个宏用于验证 Option<String> 类型的字段，适用于 DTO 结构体字段验证。
/// 它会检查字段是否存在以及是否为空字符串。
///
/// # 参数说明
/// - `$field`: Option<String> 字段
/// - `$field_name`: 字段的中文名称，用于错误提示 (类型: `&str`)
///
/// # 返回值
/// - 成功时返回字段的字符串值 (`String`)
/// - 失败时返回兼容的错误类型并可以用 `?` 操作符传播
///
/// # 使用示例
/// ```rust
/// let username = validate_option_field!(user_data.username, "用户名");
/// let email = validate_option_field!(user_data.email, "邮箱");
/// ```
///
/// # 注意事项
/// - 这个宏适用于返回 `Result<T, E>` 类型的函数，其中 E 实现了 From<String>
/// - 可以与 `?` 操作符配合使用来传播错误
/// - 兼容 String、Box<dyn std::error::Error> 等错误类型
#[macro_export]
macro_rules! validate_option_field {
    ($field:expr, $field_name:expr) => {
        match $field {
            // 字段存在且不为空字符串 - 验证成功
            Some(value) if !value.trim().is_empty() => value,

            // 字段存在但为空字符串 - 返回"不能为空"错误
            Some(_) => return Err(anyhow!("WARN:{}不能为空", $field_name).into()),

            // 字段不存在 - 返回"字段缺失"错误
            None => return Err(anyhow!("ERROR:{}字段缺失", $field_name).into()),
        }
    };
}

/// 处理服务层结果的宏
///
/// 这个宏用于统一处理服务层返回的Result类型，根据错误消息前缀自动返回相应的响应类型。
/// 支持 WARN: 和 ERROR: 前缀来区分警告和错误级别。
///
/// # 参数说明
/// - `$result`: 服务层返回的 Result<T, Box<dyn std::error::Error>> 类型
/// - `$success_msg`: 成功时的消息内容 (类型: `&str`)
///
/// # 返回值
/// - 成功时返回 Response::success
/// - WARN: 前缀时返回 Response::warn
/// - ERROR: 前缀或其他错误时返回 Response::error
///
/// # 使用示例
/// ```rust
/// pub async fn some_controller(...) -> Response<()> {
///     handle_service_result!(
///         SomeService::some_method(state, payload).await,
///         "操作成功"
///     )
/// }
/// ```
#[macro_export]
macro_rules! handle_service_result {
    ($result:expr, $success_msg:expr) => {
        match $result {
            Ok(data) => $crate::models::response::Response::success(data, $success_msg),
            Err(err) => {
                let msg = err.to_string();
                if let Some(stripped) = msg.strip_prefix("WARN:") {
                    $crate::models::response::Response::warn(stripped)
                } else if let Some(stripped) = msg.strip_prefix("ERROR:") {
                    $crate::models::response::Response::error(stripped)
                } else {
                    $crate::models::response::Response::error(msg)
                }
            }
        }
    };
}
