package service

import (
	"backend/global"
	"backend/model"
	"errors"
	"github.com/gin-gonic/gin"
	"time"
)

type ArticleService struct{}

func (ArticleService) AddArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power == 0 {
		return errors.New("权限不足")
	}

	image, err := AddImage(c)
	if err != nil {
		return err
	}
	article := model.Article{
		Author:   userClaims.ID,
		Image:    image.ID,
		Title:    c.PostForm("title"),
		Content:  c.PostForm("content"),
		Creation: time.Now(),
		Latest:   time.Now(),
	}
	return global.DB.Create(&article).Error
}

func (ArticleService) DeleteArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power == 0 {
		return errors.New("权限不足")
	}

	var article model.Article
	err = global.DB.Where("id = ?", c.Query("id")).First(&article).Error
	if err != nil {
		return errors.New("未找到该文章")
	}
	err = global.DB.Where("id = ?", article.ID).Delete(&article).Error
	if err != nil {
		return errors.New("文章删除失败")
	}
	return DeleteImage(article.Image)
}

func (ArticleService) GetOneArticle(c *gin.Context) (model.Article, error) {
	var article model.Article
	return article, global.DB.Where("id = ?", c.Query("id")).First(&article).Error
}

func (ArticleService) GetAllArticle() ([]model.ArticleList, error) {
	var list []model.ArticleList
	err := global.DB.Table("articles").
		Select("articles.*, users.nickname as AuthorNickName, images.filename as ImageFileName").
		Joins("LEFT JOIN users ON articles.author = users.id").
		Joins("LEFT JOIN images ON articles.image = images.id").
		Scan(&list).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}
	return list, nil
}
