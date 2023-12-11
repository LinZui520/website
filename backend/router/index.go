package router

import (
	"backend/global"
	"github.com/gin-gonic/gin"
	"net/http"
)

func InitRouter() *gin.Engine {
	gin.SetMode(global.Config.System.Env)
	router := gin.Default()

	//部署项目时注释掉这一行，StaticFS性能不如nginx静态服务
	router.StaticFS("/image", http.Dir("../database/mysql/data/image"))

	UserRouter(router)
	ArticleRouter(router)
	MessageRouter(router)
	AdminRouter(router)

	return router
}
