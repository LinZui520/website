package model

type Comment struct {
	ID        int    `gorm:"type:int;unsigned" json:"id"`
	Commenter string `gorm:"type:varchar(200)" json:"commenter"`
	Content   string `gorm:"type:text" json:"content"`
}
