package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func AdminRouter(router *gin.Engine) {
	adminApi := api.AdminApi{}

	admin := router.Group("api/admin")
	{
		admin.GET("/count", adminApi.GetCount)
	}

}
