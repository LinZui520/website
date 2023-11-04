package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
)

type ArticleService struct{}

func (ArticleService) AddArticle(c *gin.Context) error {
	article := model.Article{
		Title:   c.PostForm("title"),
		Content: c.PostForm("content"),
	}
	return global.DB.Create(&article).Error
}

func (ArticleService) GetOneArticle(c *gin.Context) (model.Article, error) {
	var article model.Article
	return article, global.DB.Find(&article, c.Query("id")).Error
}

func (ArticleService) GetAllArticle() ([]model.Article, error) {
	var articles []model.Article
	err := global.DB.Find(&articles).Error
	if err != nil {
		return articles, err
	}
	return articles, nil
}

func (ArticleService) DeleteArticle(c *gin.Context) error {
	var article model.Article
	return global.DB.Unscoped().Delete(&article, c.Query("id")).Error
}

func (ArticleService) UpdateArticle(c *gin.Context) error {
	var article model.Article
	return global.DB.Model(&article).Where("id = ?", c.PostForm("id")).Update("title", c.PostForm("title")).Update("content", c.PostForm("content")).Error
}
