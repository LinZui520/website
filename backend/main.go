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

	//USERNAME := "linzui"
	//PASSWORD := "123456"
	//
	//HASH, _ := bcrypt.GenerateFromPassword([]byte(PASSWORD), bcrypt.MinCost)
	//USER := model.User{
	//	Username: USERNAME,
	//	Password: string(HASH),
	//}
	//global.DB.Create(&USER)

	if router.InitRouter().Run(global.Config.System.Address()) != nil {
		global.Log.Warnln("server运行失败")
	}
}
