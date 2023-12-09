package main

import (
	"backend/core"
	"backend/global"
	"backend/router"
)

func main() {
	//读取配置文件
	core.InitConfig()
	//初始化日志
	global.Log = core.InitLogger()
	//连接MySQL
	global.DB = core.InitGorm()
	//连接Redis
	global.Redis = core.InitRedis()

	if router.InitRouter().Run(global.Config.System.Address()) != nil {
		global.Log.Warnln("server运行失败")
	}
}
