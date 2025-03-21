#[derive(serde::Serialize)]
pub struct User {
    pub id: i64,
    pub avatar: String,
    pub username: String,
    pub email: String,
    pub permission: i32,
}

#[derive(serde::Serialize)]
pub struct UserDTO {
    pub user: User,
    pub token: String,
}
