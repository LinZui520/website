#[repr(i32)]
pub enum Permission {
    Block = -1,
    User = 0,
    Admin = 1,
    Master = 2,
    Root = 3,
}

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
