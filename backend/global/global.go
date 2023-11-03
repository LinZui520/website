package global

import (
	"backend/config"
	"gorm.io/gorm"
)

var (
	Config *config.Config
	DB     *gorm.DB
)
