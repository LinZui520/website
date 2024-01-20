package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func ConversationRouter(router *gin.Engine) {
	conversationApi := api.ConversationApi{}

	conversation := router.Group("api/conversation")
	{
		conversation.GET("/chat", conversationApi.Chat)
	}

}
