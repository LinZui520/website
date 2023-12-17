package core

import (
	"fmt"
	"github.com/spf13/viper"
	"server/global"
)

func InitConfig() {
	vip := viper.New()
	vip.SetConfigName("settings")
	vip.SetConfigType("yaml")
	vip.AddConfigPath("./")
	err := vip.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
	err = vip.Unmarshal(&global.Config)
	if err != nil {
		panic(err)
	}
}
