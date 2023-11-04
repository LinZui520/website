package model

type User struct {
	ID       int    `gorm:"size:32" json:"id"`
	Username string `gorm:"size:64" json:"username"`
	Password string `gorm:"size:64" json:"password"`
}
