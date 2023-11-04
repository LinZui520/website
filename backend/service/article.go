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

func (ArticleService) GetOneArticle(c *gin.Context) (model.Article, error) {
	var article model.Article
	err := global.DB.Find(&article, c.Query("id")).Error
	if err != nil {
		return article, err
	}
	return article, nil
}

func (ArticleService) GetAllArticle() ([]model.Article, error) {
	var articles []model.Article
	err := global.DB.Find(&articles).Error
	if err != nil {
		return articles, err
	}
	return articles, nil
}
