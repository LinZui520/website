use crate::core::env::env;
use axum::http::HeaderMap;
use chrono::{Duration, Local};
use jsonwebtoken::errors::Error;
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use std::sync::OnceLock;

#[derive(Debug, Serialize, Deserialize)]
pub struct UserCredentials {
    pub avatar: String,
    pub username: String,
    pub email: String,
    pub power: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub iss: String, // 签发者标识符 服务器域名
    pub sub: i32,    // 主题标识符 用户唯一ID
    pub user: UserCredentials,
    pub exp: i64,    // 过期时间
    pub iat: i64,    // 签发时间
    pub nbf: i64,    // 生效时间
    pub aud: String, // 受众
    pub jti: usize,  // JWT唯一ID
}

static JWT_DOMAIN: OnceLock<String> = OnceLock::new();
static JWT_SECRET: OnceLock<String> = OnceLock::new();
static JWT_AUDIENCE: OnceLock<String> = OnceLock::new();

pub fn generate_jwt(sub: i32, user: UserCredentials) -> Result<String, Error> {
    let domain = JWT_DOMAIN.get_or_init(|| env("JWT_DOMAIN"));
    let secret = JWT_SECRET.get_or_init(|| env("JWT_SECRET"));
    let audience = JWT_AUDIENCE.get_or_init(|| env("JWT_AUDIENCE"));

    let claims = Claims {
        iss: domain.to_owned(),
        sub,
        user,
        exp: (Local::now() + Duration::hours(24 * 7)).timestamp(),
        iat: Local::now().timestamp(),
        nbf: Local::now().timestamp(),
        aud: audience.to_owned(),
        jti: 0,
    };

    encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
}

static VALIDATION: OnceLock<Validation> = OnceLock::new();

pub fn verify_jwt(token: &str) -> Result<Claims, Error> {
    let domain = JWT_DOMAIN.get_or_init(|| env("JWT_DOMAIN"));
    let secret = JWT_SECRET.get_or_init(|| env("JWT_SECRET"));
    let audience = JWT_AUDIENCE.get_or_init(|| env("JWT_AUDIENCE"));

    let validation = VALIDATION.get_or_init(|| {
        let mut v = Validation::new(Algorithm::HS256);
        v.set_audience(&[audience.as_str()]);
        v.set_issuer(&[domain.as_str()]);
        v
    });
    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        validation,
    )?
    .claims;

    Ok(claims)
}

pub fn parse_jwt(headers: HeaderMap) -> Option<String> {
    let cookies = headers.get(axum::http::header::COOKIE)?.to_str().ok()?;

    for cookie in cookies.split(';') {
        let mut cookie_parts = cookie.split('=').map(str::trim);

        if let (Some(cookie_name), Some(cookie_value)) = (cookie_parts.next(), cookie_parts.next())
        {
            if cookie_name == "token" && !cookie_value.is_empty() {
                return Some(cookie_value.to_string());
            }
        }
    }

    None
}
