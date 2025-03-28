#[derive(serde::Serialize)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
