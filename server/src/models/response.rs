use axum::{
    Json, http,
    response::{IntoResponse, Response as AxumResponse},
};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Response<T: Serialize> {
    code: u16,
    data: Option<T>,
    message: String,
}

impl<T: Serialize> Response<T> {
    pub fn new(code: u16, data: Option<T>, message: String) -> Self {
        Self {
            code,
            data,
            message,
        }
    }

    pub fn success(data: T, message: &str) -> Self {
        Self::new(200, Some(data), message.to_string())
    }

    pub fn warn(message: &str) -> Self {
        Self::new(400, None, message.to_string())
    }

    pub fn error<E: std::fmt::Display>(err: E) -> Self {
        tracing::error!("{}", err);
        Self::new(500, None, err.to_string())
    }
}

impl<T: Serialize> IntoResponse for Response<T> {
    fn into_response(self) -> AxumResponse {
        let status = http::StatusCode::from_u16(self.code)
            .unwrap_or(http::StatusCode::INTERNAL_SERVER_ERROR);

        (status, Json(self)).into_response()
    }
}
