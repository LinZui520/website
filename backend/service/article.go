package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
)

type ArticleService struct{}

func (ArticleService) AddArticle(c *gin.Context) {
	article := model.Article{
		Title:   c.PostForm("title"),
		Content: c.PostForm("content"),
	}
	global.DB.Create(&article)
}

func (ArticleService) GetArticle(c *gin.Context) (model.Article, error) {
	var article model.Article
	err := global.DB.Find(&article, c.Query("id")).Error
	if err != nil {
		return article, err
	}
	return article, nil
}
