use dotenvy::dotenv;

// 初始化环境变量
pub fn init_env() {
    dotenv().expect("无法加载 .env 文件");
}

/**
 * 获取指定环境变量的值
 *
 * 此函数尝试获取指定名称的环境变量值。如果环境变量不存在或无法访问，
 * 会记录一条错误日志并终止程序运行。
 *
 * @param key 环境变量名称
 * @return 环境变量的值
 *
 * @panics 当指定的环境变量未设置时，函数会记录错误并调用 std::process::exit(0)
 *
 * @example
 * ```
 * let smtp_host = env("SMTP_HOST");
 * ```
 */
pub fn env(key: &str) -> String {
    let val = std::env::var(key);
    match val {
        Ok(val) => val,
        Err(_) => {
            tracing::error!("{} ENV must be set", key);
            std::process::exit(0)
        }
    }
}
