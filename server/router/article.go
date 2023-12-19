package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
)

func ArticleRouter(router *gin.Engine) {
	articleApi := api.ArticleApi{}

	article := router.Group("api/article")
	{
		article.POST("/add", articleApi.AddArticle)
		article.DELETE("/delete", articleApi.DeleteArticle)
		article.GET("/get", articleApi.GetOneArticle)
		article.GET("/list", articleApi.GetAllArticle)
	}

}
