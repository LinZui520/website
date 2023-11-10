package model

type Comment struct {
	ID        int    `gorm:"type:int;unsigned" json:"id"`
	Commenter int    `gorm:"type:int;unsigned" json:"commenter"`
	Content   string `gorm:"type:text" json:"content"`
}
