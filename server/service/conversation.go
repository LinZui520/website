package service

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
	"server/global"
	"server/model"
	"time"
)

type ConversationService struct{}

var upgrade = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (ConversationService) Chat(c *gin.Context) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return
	}

	ws, err := upgrade.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer func(ws *websocket.Conn) {
		err := ws.Close()
		if err != nil {
			return
		}
	}(ws)

	err = dispatchConversation(ws)
	if err != nil {
		return
	}

	go subscribeConversation(ws)

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			break
		}
		var content struct{ Content string }
		err = json.Unmarshal(msg, &content)
		if err != nil {
			return
		}
		conversation, err := uploadConversation(userClaims.Id, content.Content)
		if err != nil {
			return
		}
		err = publishConversation(conversation)
		if err != nil {
			return
		}
	}

}

func dispatchConversation(ws *websocket.Conn) error {
	var conversations []model.ConversationDTO
	err := global.DB.Table("conversations").
		Select("conversations.id as Id, author, avatar, username, content, `create`").
		Joins("LEFT JOIN users ON conversations.author = users.id").
		Scan(&conversations).Error
	if err != nil {
		return err
	}

	conversationsJSON, err := json.Marshal(conversations)
	if err != nil {
		return err
	}
	err = ws.WriteMessage(websocket.TextMessage, conversationsJSON)
	if err != nil {
		return err
	}
	return nil
}

func subscribeConversation(ws *websocket.Conn) {
	subscriber := global.Redis.Subscribe("conversation")
	defer func() {
		err := subscriber.Close()
		if err != nil {
			return
		}
	}()
	channel := subscriber.Channel()
	for conversation := range channel {
		err := ws.WriteMessage(websocket.TextMessage, []byte(conversation.Payload))
		if err != nil {
			return
		}
	}
}

func publishConversation(conversation model.ConversationDTO) error {
	conversationJSON, err := json.Marshal(conversation)
	if err != nil {
		return err
	}
	err = global.Redis.Publish("conversation", conversationJSON).Err()
	if err != nil {
		return err
	}
	return nil
}

func uploadConversation(author int, content string) (model.ConversationDTO, error) {
	conversation := model.Conversation{
		Author:  author,
		Content: content,
		Create:  time.Now(),
	}
	err := global.DB.Create(&conversation).Error
	if err != nil {
		return model.ConversationDTO{}, errors.New("上传失败")
	}
	var conversationDTO model.ConversationDTO
	err = global.DB.Table("conversations").
		Select("conversations.id as Id, author, avatar, username, content, `create`").
		Joins("LEFT JOIN users ON conversations.author = users.id").
		Where("conversations.id = ?", conversation.Id).
		First(&conversationDTO).Error
	if err != nil {
		return model.ConversationDTO{}, errors.New("未查询到该对话")
	}
	return conversationDTO, nil
}
