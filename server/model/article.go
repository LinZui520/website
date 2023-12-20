package model

import "time"

type Article struct {
	Id      int       `json:"id"`
	Author  int       `json:"author"`
	Title   string    `json:"title"`
	Content string    `json:"content"`
	Create  time.Time `json:"create"`
	Update  time.Time `json:"update"`
}

type ArticleDTO struct {
	Id       int       `json:"id"`
	Author   int       `json:"author"`
	Avatar   string    `json:"avatar"`
	Username string    `json:"username"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Create   time.Time `json:"create"`
	Update   time.Time `json:"update"`
}
