package router

import (
	"backend/global"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	gin.SetMode(global.Config.System.Env)
	router := gin.Default()

	UserRouter(router)
	ArticleRouter(router)
	ImageRouter(router)

	return router
}
