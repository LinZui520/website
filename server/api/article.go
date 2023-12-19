package api

import (
	"github.com/gin-gonic/gin"
	"server/model"
	"server/service"
)

type ArticleApi struct{}

var articleService service.ArticleService

func (ArticleApi) AddArticle(c *gin.Context) {
	err := articleService.AddArticle(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "添加成功", c)
	}
}

func (ArticleApi) DeleteArticle(c *gin.Context) {
	err := articleService.DeleteArticle(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "删除成功", c)
	}
}

func (ArticleApi) GetOneArticle(c *gin.Context) {
	article, err := articleService.GetOneArticle(c)
	if err != nil {
		model.Fail(struct{}{}, err.Error(), c)
	} else if article.Title == "" {
		model.Fail(struct{}{}, "未查询到该文章", c)
	} else {
		model.OK(article, "查询成功", c)
	}
}

func (ArticleApi) GetAllArticle(c *gin.Context) {
	list, err := articleService.GetAllArticle()
	if err != nil {
		model.Fail(struct{}{}, "查询失败", c)
	} else if len(list) == 0 {
		model.Fail(list, "未查询到任何文章", c)
	} else {
		model.OK(list, "查询成功", c)
	}
}
