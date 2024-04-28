package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func CommentRouter(router *gin.Engine) {
	commentApi := api.CommentApi{}

	comment := router.Group("api/comment")
	{
		comment.POST("/add", commentApi.AddComment)
		comment.DELETE("/delete", commentApi.DeleteComment)
		comment.GET("/get", commentApi.GetCommentsByArticle)
		comment.GET("/author", commentApi.GetCommentsByUser)
		comment.GET("/list", commentApi.GetComments)
	}
}
