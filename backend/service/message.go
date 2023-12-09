package service

import (
	"backend/global"
	"backend/model"
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"time"
)

type MessageService struct{}

const messageCacheKey = "messages"

func (m MessageService) AddMessage(c *gin.Context) error {
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
	if global.DB.Create(&message).Error != nil {
		return errors.New("创建留言失败")
	}

	m.updateMessageCache()

	return nil
}

func (MessageService) GetAllMessage() ([]model.MessageList, error) {
	cachedMessages, err := global.Redis.Get(messageCacheKey).Result()
	if err == nil {
		var list []model.MessageList
		err = json.Unmarshal([]byte(cachedMessages), &list)
		if err != nil {
			return nil, errors.New("缓存数据解析失败")
		}
		return list, nil
	}

	var list []model.MessageList
	err = global.DB.Table("messages").
		Select("messages.*, users.nickname as AuthorNickname").
		Joins("LEFT JOIN users ON messages.author = users.id").
		Scan(&list).Error
	if err != nil {
		return nil, errors.New("查询留言失败")
	}

	serializedMessages, err := json.Marshal(list)
	if err != nil {
		return nil, errors.New("缓存数据序列化失败")
	}
	err = global.Redis.Set(messageCacheKey, serializedMessages, 10*time.Minute).Err()
	if err != nil {
		global.Log.Warnln("Redis 存储失败:", err)
	}

	return list, nil
}

func (MessageService) updateMessageCache() {
	err := global.Redis.Del(messageCacheKey).Err()
	if err != nil {
		global.Log.Warnln("Redis 删除缓存失败:", err)
	}
}
