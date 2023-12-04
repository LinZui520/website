package model

import "time"

type Image struct {
	ID       int       `gorm:"type:int;unsigned" json:"id"`
	URL      string    `gorm:"type:varchar(64);not null" json:"url"`
	Creation time.Time `gorm:"type:datetime;not null" json:"creation"`
}
