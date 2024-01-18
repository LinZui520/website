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
		image.GET("/list", imageApi.GetAllImage)
		image.GET("/get", imageApi.GetImageByAuthor)
		image.DELETE("/delete", imageApi.DeleteImage)
		image.GET("/count", imageApi.ImageCount)
	}

}
