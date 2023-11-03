package main

import (
	"backend/core"
	"backend/global"
	"fmt"
)

func main() {
	core.InitConfig()
	global.Log = core.InitLogger()
	global.Log.Warnln("你好")
	global.Log.Error("你好")
	global.Log.Infof("你好")
	global.DB = core.InitGorm()
	fmt.Println(global.DB)
}
