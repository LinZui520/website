package router

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"server/global"
)

func InitRouter() *gin.Engine {
	gin.SetMode(global.Config.System.Env)
	router := gin.Default()

	//部署项目时注释掉这一行，StaticFS性能不如nginx静态服务
	router.StaticFS("/image", http.Dir("../database/mysql/data/image"))

	UserRouter(router)
	ArticleRouter(router)
	CommentRouter(router)
	ImageRouter(router)
	MessageRouter(router)
	ConversationRouter(router)

	return router
}
