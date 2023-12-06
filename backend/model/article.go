package model

import "time"

type Article struct {
	ID       int       `gorm:"type:int;unsigned" json:"id"`
	Author   int       `gorm:"type:int;unsigned;not null;" json:"author"`
	Image    int       `gorm:"type:int;unsigned;not null;" json:"image"`
	Title    string    `gorm:"type:varchar(256);not null;" json:"title"`
	Content  string    `gorm:"type:longtext" json:"content"`
	Creation time.Time `gorm:"type:datetime;not null" json:"creation"`
	Latest   time.Time `gorm:"type:datetime;null" json:"latest"`
}

type ArticleList struct {
	Article        Article
	ImageFilename  string
	AuthorNickName string
}
