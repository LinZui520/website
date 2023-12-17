package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func UserRouter(router *gin.Engine) {
	userApi := api.UserApi{}

	user := router.Group("api/user")
	{
		user.GET("/verify", userApi.UserVerify)
		user.POST("/register", userApi.UserRegister)
	}

}
