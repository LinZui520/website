package api

import "github.com/gin-gonic/gin"

type SettingsApi struct {
}

func (SettingsApi) SettingsInfoView(c *gin.Context) {
	c.JSON(200, gin.H{"msg": "xxx"})
}
