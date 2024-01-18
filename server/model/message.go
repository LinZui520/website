package model

import "time"

type Message struct {
	Id      int       `json:"id"`
	Author  int       `json:"author"`
	Content string    `json:"content"`
	Create  time.Time `json:"create"`
}

type MessageDTO struct {
	Id       int       `json:"id"`
	Author   int       `json:"author"`
	Avatar   string    `json:"avatar"`
	Username string    `json:"username"`
	Content  string    `json:"content"`
	Create   time.Time `json:"create"`
}
