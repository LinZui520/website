package model

type Image struct {
	ID  int    `gorm:"type:int;unsigned" json:"id"`
	URL string `gorm:"type:varchar(32) not null" json:"url"`
}
