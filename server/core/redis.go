package core

import (
	"fmt"
	"github.com/go-redis/redis"
	"server/global"
	"strconv"
)

func InitRedis() *redis.Client {
	host := global.Config.Redis.Host
	port := global.Config.Redis.Port
	password := global.Config.Redis.Password
	db := global.Config.Redis.DB
	RedisClient := redis.NewClient(&redis.Options{
		Addr:     host + ":" + strconv.Itoa(port),
		Password: password,
		DB:       db,
	})

	_, err := RedisClient.Ping().Result()
	if err != nil {
		global.Log.Fatalf(fmt.Sprintf("Redis连接失败：%s", err))
	}
	return RedisClient
}
