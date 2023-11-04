package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type ArticleApi struct{}

var articleService service.ArticleService

func (ArticleApi) AddArticle(c *gin.Context) {
	articleService.AddArticle(c)
	model.OK(map[string]string{}, "添加成功", c)
}
