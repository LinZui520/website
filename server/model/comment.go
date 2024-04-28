package model

import "time"

type Comment struct {
	Id      int       `json:"id"`
	Author  int       `json:"author"`
	Article int       `json:"article"`
	Content string    `json:"content"`
	Create  time.Time `json:"create"`
}

type CommentDTO struct {
	Id       int       `json:"id"`
	Author   int       `json:"author"`
	Avatar   string    `json:"avatar"`
	Username string    `json:"username"`
	Article  int       `json:"article"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Create   time.Time `json:"create"`
}
