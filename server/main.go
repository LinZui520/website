package main

import (
	"fmt"
	"server/core"
	"server/global"
	"server/router"
)

func main() {
	core.InitConfig()
	global.Log = core.InitLogger()
	global.DB = core.InitMySQL()
	global.Redis = core.InitRedis()
	fmt.Println(global.Config)
	if router.InitRouter().Run(global.Config.System.Address()) != nil {
		global.Log.Warnln("server运行失败")
	}
}
