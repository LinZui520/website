package global

import (
	"github.com/go-redis/redis"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"server/config"
)

var (
	Config config.Config
	DB     *gorm.DB
	Log    *logrus.Logger
	Redis  *redis.Client
)
