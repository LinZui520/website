package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine) {
	userApi := api.Api.UserApi
	user := router.Group("api/user")
	{
		user.POST("/login", userApi.UserLogin)
		user.POST("/register", userApi.UserRegister)
		user.GET("/info", userApi.UserInfo)
		user.GET("/token/login", userApi.UserTokenLogin)
	}

}
