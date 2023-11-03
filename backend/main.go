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
	//连接数据库
	global.DB = core.InitGorm()

	Router := router.InitRouter()
	global.Log.Infof("blog_server运行在：%s", global.Config.System.Addr())
	err := Router.Run(global.Config.System.Addr())
	if err != nil {
		return
	}
}
