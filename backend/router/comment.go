package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func CommentRouter(router *gin.Engine) {
	commentApi := api.Api.CommentApi
	comment := router.Group("api/comment")
	{
		comment.POST("/add", commentApi.AddComment)
		comment.GET("/list", commentApi.GetAllComment)
	}
}
