package router

import (
	"backend/global"
	"github.com/gin-gonic/gin"
	"net/http"
)

func InitRouter() *gin.Engine {
	gin.SetMode(global.Config.System.Env)
	router := gin.Default()
	router.StaticFS("image", http.Dir("./image"))

	UserRouter(router)
	ArticleRouter(router)

	return router
}
