package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine) {
	userApi := api.Api.UserApi
	user := router.Group("api/user")
	{
		user.GET("/get", userApi.GetUser)
		user.POST("/add", userApi.AddUser)
		user.POST("/login", userApi.UserLogin)
	}

}
