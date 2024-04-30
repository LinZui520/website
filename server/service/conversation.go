package service

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
	"server/global"
	"server/model"
	"sync"
	"time"
)

type ConversationService struct {
	Count int
	Mutex sync.Mutex
}

type SendMessage struct {
	Type string `json:"type"`
	Data any    `json:"data"`
}

type ReceiveMessage struct {
	Type string
	Data struct {
		Id       int
		Author   int
		Avatar   string
		Username string
		Content  string
		Create   time.Time
	}
}

var upgrade = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (cs *ConversationService) Chat(c *gin.Context) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return
	}

	ws, err := upgrade.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	cs.incrementConnectionCount()
	err = publishWebSocketCount(cs, ws)
	if err != nil {
		return
	}

	defer func(ws *websocket.Conn) {
		cs.decrementConnectionCount()

		err = publishWebSocketCount(cs, ws)
		if err != nil {
			return
		}

		err = ws.Close()
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
			return
		}
		var message ReceiveMessage
		err = json.Unmarshal(msg, &message)
		if err != nil {
			return
		}
		switch message.Type {
		case "increment":
			conversation, err := uploadConversation(*userClaims, message)
			if err != nil {
				continue
			}
			err = publishConversation(conversation)
			if err != nil {
				return
			}
			break
		case "decrement":
			id, err := deleteConversation(message)
			if err != nil {
				continue
			}
			err = withdrawConversation(id)
			if err != nil {
				return
			}
			break
		case "ping":
			err = pongBrowser(ws)
			if err != nil {
				continue
			}
			break
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

	message := SendMessage{
		Type: "conversations",
		Data: conversations,
	}
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return err
	}
	err = ws.WriteMessage(websocket.TextMessage, messageJSON)
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

func uploadConversation(userClaims model.UserClaims, message ReceiveMessage) (model.ConversationDTO, error) {
	conversation := model.Conversation{
		Author:  userClaims.Id,
		Content: message.Data.Content,
		Create:  time.Now(),
	}
	err := global.DB.Create(&conversation).Error
	if err != nil {
		return model.ConversationDTO{}, errors.New("上传失败")
	}
	conversationDTO := model.ConversationDTO{
		Id:       conversation.Id,
		Author:   conversation.Author,
		Avatar:   message.Data.Avatar,
		Username: message.Data.Username,
		Content:  message.Data.Content,
		Create:   conversation.Create,
	}
	return conversationDTO, nil
}

func publishConversation(conversation model.ConversationDTO) error {
	message := SendMessage{
		Type: "conversation",
		Data: conversation,
	}
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return err
	}
	err = global.Redis.Publish("conversation", messageJSON).Err()
	if err != nil {
		return err
	}
	return nil
}

func deleteConversation(message ReceiveMessage) (int, error) {
	var conversation model.Conversation
	if time.Now().Sub(message.Data.Create).Minutes() > 3 {
		return 0, errors.New("时间超过3分钟")
	}
	err := global.DB.Where("id = ?", message.Data.Id).Delete(&conversation).Error
	if err != nil {
		return 0, err
	}
	return message.Data.Id, nil
}

func withdrawConversation(id int) error {
	message := SendMessage{
		Type: "decrement",
		Data: id,
	}
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return err
	}
	err = global.Redis.Publish("conversation", messageJSON).Err()
	if err != nil {
		return err
	}
	return nil
}

func pongBrowser(ws *websocket.Conn) error {
	message := SendMessage{
		Type: "pong",
		Data: nil,
	}
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return err
	}
	err = ws.WriteMessage(websocket.TextMessage, messageJSON)
	if err != nil {
		return err
	}
	return nil
}

func (cs *ConversationService) incrementConnectionCount() {
	cs.Mutex.Lock()
	defer cs.Mutex.Unlock()
	cs.Count++
}

func (cs *ConversationService) decrementConnectionCount() {
	cs.Mutex.Lock()
	defer cs.Mutex.Unlock()
	cs.Count--
}

func publishWebSocketCount(cs *ConversationService, ws *websocket.Conn) error {
	cs.Mutex.Lock()
	defer cs.Mutex.Unlock()
	message := SendMessage{
		Type: "count",
		Data: cs.Count,
	}
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return err
	}
	err = global.Redis.Publish("conversation", messageJSON).Err()
	if err != nil {
		return err
	}
	err = ws.WriteMessage(websocket.TextMessage, messageJSON)
	if err != nil {
		return err
	}
	return nil
}
