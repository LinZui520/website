package model

type Image struct {
	ID     int    `gorm:"type:int;unsigned" json:"id"`
	Name   string `gorm:"type:varchar(200)" json:"name"`
	Belong int    `gorm:"type:int;unsigned" json:"belong"`
}
