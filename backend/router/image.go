package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func ImageRouter(router *gin.Engine) {
	imageApi := api.Api.ImageApi
	image := router.Group("image")
	{
		image.POST("/add", imageApi.AddImage)
	}
}
