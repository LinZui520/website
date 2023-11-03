package api

import (
	"backend/model"
	"github.com/gin-gonic/gin"
)

type SettingsApi struct {
}

func (SettingsApi) SettingsInfoView(c *gin.Context) {
	model.OK(map[string]string{}, "你好", c)
}
