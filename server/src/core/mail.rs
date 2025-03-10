use crate::core::env::env;
use lettre::transport::smtp::Error;
use lettre::transport::smtp::client::{Tls, TlsParameters};
use lettre::transport::smtp::response::Response;
use lettre::{
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
    transport::smtp::authentication::Credentials,
};
use once_cell::sync::Lazy;
use rand::Rng;
use regex::Regex;

pub fn create_mailer() -> AsyncSmtpTransport<Tokio1Executor> {
    let creds = Credentials::new(env("SMTP_USER"), env("SMTP_PASSWORD"));

    let mailer: AsyncSmtpTransport<Tokio1Executor> =
        AsyncSmtpTransport::<Tokio1Executor>::relay(env("SMTP_HOST").as_str())
            .unwrap()
            .port(env("SMTP_PORT").parse().unwrap())
            .tls(Tls::Required(TlsParameters::new(env("SMTP_HOST")).unwrap()))
            .credentials(creds)
            .build();

    mailer
}

pub fn generate_random_code() -> u32 {
    rand::rng().random_range(100000..1000000)
}

pub async fn send_verification_email(
    mailer: &AsyncSmtpTransport<Tokio1Executor>,
    target: String,
    code: String,
) -> Result<Response, Error> {
    let email = Message::builder()
        .from(env("SMTP_USER").parse().unwrap())
        .to(target.parse().unwrap())
        .subject(env("SMTP_SUBJECT"))
        .body(env("SMTP_TEXT") + code.as_str())
        .unwrap();

    mailer.send(email).await
}

// 编译一次正则表达式并重用
static EMAIL_REGEX: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$").unwrap()
});

pub fn is_valid_email(email: &str) -> bool {
    email.len() < 255 && EMAIL_REGEX.is_match(email)
}
