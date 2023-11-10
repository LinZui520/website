package model

type Article struct {
	ID      int    `gorm:"type:int;unsigned" json:"id"`
	Title   string `gorm:"type:int unsigned not null;" json:"title"`
	Image   int    `gorm:"type:varchar(200) not null;" json:"image"`
	Content string `gorm:"type:longtext" json:"content"`
}
