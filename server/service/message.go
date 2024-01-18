package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"server/global"
	"server/model"
	"time"
)

type MessageService struct{}

func (MessageService) AddMessage(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	message := model.Message{
		Author:  userClaims.Id,
		Content: c.PostForm("content"),
		Create:  time.Now(),
	}
	return global.DB.Create(&message).Error
}

func (MessageService) GetAllMessage() ([]model.MessageDTO, error) {
	var messages []model.MessageDTO
	err := global.DB.Table("messages").
		Select("messages.id as Id, author, avatar, username, content, `create`").
		Joins("LEFT JOIN users ON messages.author = users.id").
		Order("`create` desc").
		Scan(&messages).Error
	if err != nil {
		return nil, errors.New("查询失败")
	}
	return messages, nil
}

func (MessageService) DeleteMessage(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	var message model.Message
	err = global.DB.Where("id = ?", c.Query("id")).First(&message).Error
	if err != nil {
		return errors.New("未查询到该留言")
	}

	if userClaims.Id != message.Author && userClaims.Power <= 1 {
		return errors.New("没有权限删除该留言")
	}

	return global.DB.Where("id = ?", message.Id).Delete(&message).Error
}

func (MessageService) GetMessageByAuthor(c *gin.Context) ([]model.MessageDTO, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return nil, errors.New("权限不足")
	}

	var messages []model.MessageDTO
	err = global.DB.Table("messages").
		Select("messages.id as Id, author, avatar, username, content, `create`").
		Joins("LEFT JOIN users ON messages.author = users.id").
		Order("`create` desc").
		Where("messages.author = ?", userClaims.Id).
		Scan(&messages).Error
	if err != nil {
		return nil, errors.New("查询失败")
	}
	return messages, nil
}

func (MessageService) MessageCount(c *gin.Context) (int64, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return 0, errors.New("权限不足")
	}
	var count int64
	err = global.DB.Model(&model.Message{}).Count(&count).Error
	if err != nil {
		return 0, errors.New("查询留言数失败")
	}
	return count, nil
}
