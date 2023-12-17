package model

import "time"

type User struct {
	Id       int       `json:"id"`
	Avatar   int       `json:"avatar"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Password string    `json:"password"`
	Power    int       `json:"power"`
	Register time.Time `json:"register"`
	Login    time.Time `json:"login"`
}
