#[derive(serde::Serialize)]
pub struct User {
    pub id: i32,
    pub avatar: String,
    pub username: String,
    pub email: String,
    pub power: i32,
}

#[derive(serde::Serialize)]
pub struct UserDTO {
    pub user: User,
    pub token: String,
}
