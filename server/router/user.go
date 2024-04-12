package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func UserRouter(router *gin.Engine) {
	userApi := api.UserApi{}

	user := router.Group("api/user")
	{
		user.POST("/verify", userApi.UserVerify)
		user.POST("/register", userApi.UserRegister)
		user.POST("/login", userApi.UserLogin)
		user.GET("/token", userApi.UserTokenLogin)
		user.POST("/email", userApi.UserEmailLogin)
		user.GET("/list", userApi.GetAllUser)
		user.GET("/block", userApi.BlockUser)
		user.GET("/boost", userApi.BoostUser)
		user.POST("/security", userApi.UserSecurity)
		user.POST("/avatar", userApi.UploadAvatar)
		user.GET("/count", userApi.UserCount)
		user.POST("/username", userApi.UpdateUsername)
		user.GET("/info", userApi.GetUserInfo)
	}

}
