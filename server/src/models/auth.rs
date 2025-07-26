use crate::models::user::UserVO;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthVO {
    pub user: UserVO,
    pub token: String,
}

impl AuthVO {
    pub fn new(user: UserVO, token: String) -> Self {
        Self { user, token }
    }
}
