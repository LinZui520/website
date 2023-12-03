package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine) {
	userApi := api.UserApi{}

	user := router.Group("api/user")
	{
		user.POST("/register", userApi.UserRegister)
		user.POST("/login", userApi.UserLogin)
		user.GET("/token", userApi.UserTokenLogin)
	}

}
