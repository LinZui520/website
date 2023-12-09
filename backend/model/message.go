package model

import "time"

type Message struct {
	ID       int       `json:"id"`
	Author   int       `json:"author"`
	Content  string    `json:"content"`
	Creation time.Time `json:"creation"`
}

type MessageList struct {
	ID             int       `json:"id"`
	Author         int       `json:"author"`
	AuthorNickName string    `json:"nickname"`
	Content        string    `json:"content"`
	Creation       time.Time `json:"creation"`
}
