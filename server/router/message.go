package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func MessageRouter(router *gin.Engine) {
	messageApi := api.MessageApi{}

	message := router.Group("api/message")
	{
		message.POST("/add", messageApi.AddMessage)
		message.GET("/list", messageApi.GetAllMessage)
		message.DELETE("/delete", messageApi.DeleteMessage)
		message.GET("/get", messageApi.GetMessageByAuthor)
		message.GET("/count", messageApi.MessageCount)
	}

}
