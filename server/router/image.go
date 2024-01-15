package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func ImageRouter(router *gin.Engine) {
	imageApi := api.ImageApi{}

	image := router.Group("api/image")
	{
		image.POST("/upload", imageApi.UploadImage)
		image.GET("/get", imageApi.GetImagesByAuthor)
		image.DELETE("/delete", imageApi.DeleteImage)
	}

}
