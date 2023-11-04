package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine) {
	userApi := api.Api.UserApi
	user := router.Group("user")
	{
		user.GET("/get", userApi.UserGet)
		user.POST("/add", userApi.UserAdd)
	}

}
