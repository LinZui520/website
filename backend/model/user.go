package model

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type User struct {
	ID       int       `json:"id"`
	Nickname string    `json:"nickname"`
	Username string    `json:"username"`
	Password string    `json:"password"`
	Power    int       `json:"power"`
	Creation time.Time `json:"creation"`
	Latest   time.Time `json:"latest"`
}

type UserClaims struct {
	ID       int
	Username string
	Password string
	Power    int
	jwt.RegisteredClaims
}
