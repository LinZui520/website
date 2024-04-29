package service

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"server/global"
	"server/model"
	"time"
)

type MessageService struct{}

const messageCacheKey = "messages"

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
	if global.DB.Create(&message).Error != nil {
		return errors.New("添加失败")
	}

	err = global.Redis.Del(messageCacheKey).Err()
	if err != nil {
		global.Log.Warnln("Redis 删除留言缓存失败:", err)
	}

	return nil
}

func (MessageService) GetAllMessage() ([]model.MessageDTO, error) {
	var messages []model.MessageDTO

	cachedMessages, err := global.Redis.Get(messageCacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedMessages), &messages)
		if err == nil {
			global.Log.Infoln("Redis 缓存留言数据获取成功")
			return messages, nil
		} else {
			global.Log.Warnln("Redis 缓存留言数据解析失败:", err)
		}
	}

	err = global.DB.Table("messages").
		Select("messages.id as Id, author, avatar, username, content, `create`").
		Joins("LEFT JOIN users ON messages.author = users.id").
		Order("`create` desc").
		Scan(&messages).Error
	if err != nil {
		return nil, errors.New("查询失败")
	}

	serializedMessages, err := json.Marshal(messages)
	if err != nil {
		global.Log.Warnln("Redis 留言数据序列化失败:", err)
	}
	err = global.Redis.Set(messageCacheKey, serializedMessages, 10*time.Minute).Err()
	if err != nil {
		global.Log.Warnln("Redis 存储留言失败:", err)
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

	if userClaims.Id != message.Author && userClaims.Power <= 0 {
		return errors.New("没有权限删除该留言")
	}

	if global.DB.Where("id = ?", message.Id).Delete(&message).Error != nil {
		return errors.New("删除失败")
	}

	err = global.Redis.Del(messageCacheKey).Err()
	if err != nil {
		global.Log.Warnln("Redis 删除留言缓存失败:", err)
	}

	return nil
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
	if err != nil || userClaims.Power < 0 {
		return 0, errors.New("权限不足")
	}
	var count int64
	err = global.DB.Model(&model.Message{}).Count(&count).Error
	if err != nil {
		return 0, errors.New("查询留言数失败")
	}
	return count, nil
}
