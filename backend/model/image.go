package model

import "time"

type Image struct {
	ID       int       `gorm:"type:int;unsigned" json:"id"`
	Filename string    `gorm:"type:varchar(64);not null" json:"filename"`
	Creation time.Time `gorm:"type:datetime;not null" json:"creation"`
}
