package model

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type User struct {
	ID       int       `gorm:"type:int;unsigned" json:"id"`
	Nickname string    `gorm:"type:varchar(32);not null" json:"nickname"`
	Username string    `gorm:"type:varchar(32);not null" json:"username"`
	Password string    `gorm:"type:char(32);not null" json:"password"`
	Power    int       `gorm:"type:int;not null" json:"power"`
	Creation time.Time `gorm:"type:datetime;not null" json:"creation"`
	Latest   time.Time `gorm:"type:datetime;null" json:"latest"`
}

type UserClaims struct {
	ID       int
	Username string
	Password string
	Power    int
	jwt.RegisteredClaims
}
