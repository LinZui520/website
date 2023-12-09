package model

import "time"

type Image struct {
	ID       int       `json:"id"`
	Filename string    `json:"filename"`
	Creation time.Time `json:"creation"`
}
