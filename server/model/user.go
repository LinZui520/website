package model

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type User struct {
	Id       int       `json:"id"`
	Avatar   string    `json:"avatar"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	Power    int       `json:"power"`
	Register time.Time `json:"register"`
	Login    time.Time `json:"login"`
}

type UserClaims struct {
	Id       int
	Username string
	Password string
	Power    int
	jwt.RegisteredClaims
}

type UserDTO struct {
	Id          int    `json:"id"`
	Avatar      string `json:"avatar"`
	Username    string `json:"username"`
	Email       string `json:"email"`
	Power       int    `json:"power"`
	TokenString string `json:"token"`
}
