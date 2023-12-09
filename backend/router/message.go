package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func MessageRouter(router *gin.Engine) {
	messageApi := api.MessageApi{}

	message := router.Group("api/message")
	{
		message.POST("/add", messageApi.AddMessage)
		message.GET("/list", messageApi.GetAllMessage)
	}

}
