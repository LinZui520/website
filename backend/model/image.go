package model

import "time"

type Image struct {
	ID       int       `json:"id"`
	FileName string    `json:"filename"`
	Creation time.Time `json:"creation"`
}
