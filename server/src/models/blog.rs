use crate::models::category::Category;
use crate::models::user::User;

#[derive(serde::Serialize)]
pub struct Blog {
    pub id: i64,
    pub author: i64,
    pub title: String,
    pub category: i64,
    pub content: String,
    pub publish: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub updated_by: i64,
}

#[derive(serde::Serialize)]
pub struct BlogDTO {
    pub id: i64,
    pub author: User,
    pub title: String,
    pub category: Category,
    pub content: String,
    pub publish: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub updated_by: i64,
}
