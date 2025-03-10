use chrono::Local;
use tracing_appender::rolling::{RollingFileAppender, Rotation};
use tracing_appender::{non_blocking, rolling};
use tracing_subscriber::fmt::format::Writer;
use tracing_subscriber::fmt::time::FormatTime;

struct CustomTimeFormat;

impl FormatTime for CustomTimeFormat {
    fn format_time(&self, w: &mut Writer<'_>) -> std::fmt::Result {
        write!(w, "{}", Local::now().format("%Y-%m-%d %H:%M:%S%.3f"))
    }
}

// 初始化异步日志系统
pub fn init_async_journal() -> non_blocking::WorkerGuard {
    let journal_directory =
        std::env::var("JOURNAL_DIRECTORY").expect("JOURNAL_DIR ENV must be set");
    let journal_filename_prefix =
        std::env::var("JOURNAL_FILENAME_PREFIX").expect("JOURNAL_FILENAME_PREFIX ENV must be set");

    let file_appender: RollingFileAppender = rolling::Builder::new()
        .rotation(Rotation::DAILY)
        .filename_prefix(journal_filename_prefix)
        .filename_suffix("log")
        .max_log_files(30)
        .build(journal_directory)
        .expect("日志初始化失败");

    let (non_blocking_writer, guard) = non_blocking(file_appender);

    tracing_subscriber::fmt()
        .with_timer(CustomTimeFormat)
        .with_ansi(false)
        .with_writer(non_blocking_writer)
        .init();

    guard
}
