package router

import (
	"backend/api"
	"github.com/gin-gonic/gin"
)

func ArticleRouter(router *gin.Engine) {
	articleApi := api.Api.ArticleApi
	article := router.Group("article")
	{
		article.POST("/add", articleApi.AddArticle)
		article.GET("/get", articleApi.GetOneArticle)
		article.GET("/list", articleApi.GetAllArticle)
		article.DELETE("/delete", articleApi.DeleteArticle)
		article.PUT("/update", articleApi.UpdateArticle)
	}
}
