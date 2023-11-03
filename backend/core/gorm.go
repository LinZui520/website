package core

import (
	"backend/global"
	"fmt"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"time"
)

func InitGorm() *gorm.DB {
	if viper.Get("mysql.host") == "" {
		//未配置mysql，取消gorm连接
		return nil
	}
	dsn := global.Config.Mysql.Dsn()

	var mysqlLogger logger.Interface
	if global.Config.System.Env == "debug" {
		mysqlLogger = logger.Default.LogMode(logger.Info)
	} else {
		mysqlLogger = logger.Default.LogMode(logger.Error)
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: mysqlLogger,
	})

	if err != nil {
		log.Fatalf(fmt.Sprintln("[%s] mysql连接失败", dsn))
	}

	sqlDB, _ := db.DB()
	sqlDB.SetMaxIdleConns(10)               //最大空闲连接数
	sqlDB.SetMaxOpenConns(100)              //最多可容纳
	sqlDB.SetConnMaxLifetime(time.Hour * 4) //连接最大复用时间，不能超过mysql的wait_timeout
	return db
}
