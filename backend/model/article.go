package model

type Article struct {
	ID      int    `gorm:"type:int;unsigned" json:"id"`
	Title   string `gorm:"type:varchar(200);" json:"password"`
	Content string `gorm:"type:longtext" json:"content"`
}
