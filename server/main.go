package main

import (
	"server/core"
	"server/global"
	"server/router"
)

func main() {
	core.InitConfig()
	global.Log = core.InitLogger()
	global.DB = core.InitMySQL()
	global.Redis = core.InitRedis()

	if router.InitRouter().Run(global.Config.System.Address()) != nil {
		global.Log.Fatalf("server运行失败")
	}
}
