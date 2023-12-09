package service

import (
	"backend/global"
	"backend/model"
	"errors"
	"github.com/gin-gonic/gin"
	"time"
)

type MessageService struct{}

func (MessageService) AddMessage(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil {
		return errors.New("权限不足，请先登陆")
	}

	message := model.Message{
		Author:   userClaims.ID,
		Content:  c.PostForm("content"),
		Creation: time.Now(),
	}
	return global.DB.Create(&message).Error
}

func (MessageService) GetAllMessage() ([]model.MessageList, error) {
	var list []model.MessageList
	err := global.DB.Table("messages").
		Select("messages.*, users.nickname as AuthorNickName").
		Joins("LEFT JOIN users ON messages.author = users.id").
		Scan(&list).Error
	if err != nil {
		return nil, errors.New("查询留言失败")
	}
	return list, nil
}
