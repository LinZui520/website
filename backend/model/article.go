package model

import "time"

type Article struct {
	ID       int       `json:"id"`
	Author   int       `json:"author"`
	Image    int       `json:"image"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Creation time.Time `json:"creation"`
	Latest   time.Time `json:"latest"`
}

type ArticleList struct {
	ID             int       `json:"id"`
	Author         int       `json:"author"`
	AuthorNickname string    `json:"nickname"`
	Image          int       `json:"image"`
	ImageFilename  string    `json:"filename"`
	Title          string    `json:"title"`
	Content        string    `json:"content"`
	Creation       time.Time `json:"creation"`
	Latest         time.Time `json:"latest"`
}
