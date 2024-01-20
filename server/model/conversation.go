package model

import "time"

type Conversation struct {
	Id      int       `json:"id"`
	Author  int       `json:"author"`
	Content string    `json:"content"`
	Create  time.Time `json:"create"`
}

type ConversationDTO struct {
	Id       int       `json:"id"`
	Author   int       `json:"author"`
	Avatar   string    `json:"avatar"`
	Username string    `json:"username"`
	Content  string    `json:"content"`
	Create   time.Time `json:"create"`
}
