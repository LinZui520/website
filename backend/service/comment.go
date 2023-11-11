package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
	"strconv"
)

type CommentService struct{}

func (CommentService) AddComment(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	_, err := ParseToken(tokenString)
	if err != nil {
		return err
	}
	commenter, err := strconv.Atoi(c.PostForm("commenter"))
	if err != nil {
		return err
	}
	comment := model.Comment{
		Commenter: commenter,
		Content:   c.PostForm("content"),
	}
	return global.DB.Create(&comment).Error
}

func (CommentService) GetAllComment() ([]model.Comment, error) {
	var comments []model.Comment
	return comments, global.DB.Find(&comments).Error
}
