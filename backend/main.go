package main

import (
	"backend/core"
	"backend/global"
)

func main() {
	core.InitConfig()
	global.DB = core.InitGorm()
}
