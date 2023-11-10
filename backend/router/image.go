package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func ImageRouter(router *gin.Engine) {
	imageApi := api.Api.ImageApi
	image := router.Group("api/image")
	{
		image.GET("/get", imageApi.GetImage)
	}
}
