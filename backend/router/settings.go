package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func SettingsRouter(router *gin.Engine) {
	settingsApi := api.Api.SettingsApi
	router.GET("", settingsApi.SettingsInfoView)
}
