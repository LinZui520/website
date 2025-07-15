/// 表单字段验证宏
///
/// 这个宏用于简化 JSON 表单字段的验证过程，减少重复代码。
/// 它会检查指定字段是否存在、是否为字符串类型、以及是否为空字符串。
///
/// # 参数说明
/// - `$form`: JSON 表单对象 (类型: `serde_json::Value`)
/// - `$field`: 要验证的字段名 (类型: `&str`)  
/// - `$field_name`: 字段的中文名称，用于错误提示 (类型: `&str`)
///
/// # 返回值
/// - 成功时返回字段的字符串值 (`&str`)
/// - 失败时直接返回 `Response::warn()` 错误响应并退出函数
///
/// # 验证逻辑
/// 1. 首先尝试从 JSON 对象中获取指定字段
/// 2. 然后尝试将字段值转换为字符串类型
/// 3. 检查字符串是否为空：
///    - 如果字段存在且非空：返回字段值
///    - 如果字段存在但为空字符串：返回"不能为空"错误
///    - 如果字段不存在：返回"字段缺失"错误
///
/// # 使用示例
/// ```rust
/// let username = validate_field!(form, "username", "用户名");
/// let email = validate_field!(form, "email", "邮箱");
/// ```
///
/// # 注意事项
/// - 这个宏会在验证失败时直接 `return`，所以只能在返回 `Response<T>` 类型的函数中使用
/// - 宏展开后的代码会创建一个新的变量来存储验证后的字段值
/// - 错误信息会自动格式化为中文提示
#[macro_export]
macro_rules! validate_field {
    ($form:expr, $field:expr, $field_name:expr) => {
        // 使用 match 表达式进行字段验证
        match $form.get($field)           // 1. 从 JSON 对象中获取字段
                  .and_then(|v| v.as_str()) // 2. 尝试转换为字符串类型
        {
            // 字段存在且不为空字符串 - 验证成功
            Some(value) if !value.is_empty() => value,

            // 字段存在但为空字符串 - 返回"不能为空"错误
            Some(_) => return Response::warn(&format!("{}不能为空", $field_name)),

            // 字段不存在 - 返回"字段缺失"错误
            None => return Response::warn(&format!("{}字段缺失", $field_name)),
        }
    };
}
