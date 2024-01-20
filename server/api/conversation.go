package api

import (
	"github.com/gin-gonic/gin"
	"server/service"
)

type ConversationApi struct{}

var conversationService service.ConversationService

func (ConversationApi) Chat(c *gin.Context) {
	conversationService.Chat(c)
}
