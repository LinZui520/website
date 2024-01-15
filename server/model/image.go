package model

import "time"

type Image struct {
	Id       int       `json:"id"`
	Author   int       `json:"author"`
	Filename string    `json:"filename"`
	Create   time.Time `json:"create"`
}
