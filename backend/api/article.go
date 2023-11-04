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

func (ArticleApi) GetOneArticle(c *gin.Context) {
	article, err := articleService.GetOneArticle(c)
	if err != nil {
		model.Fail(map[string]string{}, "查询失败", c)
	} else if article.Title == "" {
		model.Fail(map[string]string{}, "未查询到该文章", c)
	} else {
		model.OK(article, "查询成功", c)
	}
}

func (ArticleApi) GetAllArticle(c *gin.Context) {
	articles, err := articleService.GetAllArticle()
	if err != nil {
		model.Fail(map[string]string{}, "查询失败", c)
	} else if articles == nil {
		model.Fail(map[string]string{}, "未查询到任何文章", c)
	} else {
		model.OK(articles, "查询成功", c)
	}
}
