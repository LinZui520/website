package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"server/global"
	"server/model"
	"time"
)

type ArticleService struct{}

func (ArticleService) AddArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return errors.New("权限不足")
	}

	article := model.Article{
		Author:  userClaims.Id,
		Title:   c.PostForm("title"),
		Content: c.PostForm("content"),
		Create:  time.Now(),
		Update:  time.Now(),
	}
	return global.DB.Create(&article).Error
}

func (ArticleService) DeleteArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return errors.New("权限不足")
	}

	var article model.Article
	err = global.DB.Where("id = ?", c.Query("id")).First(&article).Error
	if err != nil {
		return errors.New("未查询到该文章")
	}

	if userClaims.Id != article.Author && userClaims.Power == 1 {
		return errors.New("没有权限删除该文章")
	}

	return global.DB.Where("id = ?", article.Id).Delete(&article).Error
}

func (ArticleService) GetOneArticle(c *gin.Context) (model.ArticleDTO, error) {
	var article model.ArticleDTO
	err := global.DB.Table("articles").
		Select("articles.id as Id, author, username, avatar, title, content, `create`, `update`").
		Joins("LEFT JOIN users ON articles.author = users.id").
		Where("articles.id = ?", c.Query("id")).
		First(&article).Error
	if err != nil {
		return model.ArticleDTO{}, errors.New("未查询到该文章")
	}
	return article, nil
}

func (ArticleService) GetAllArticle() ([]model.ArticleDTO, error) {
	var articles []model.ArticleDTO
	err := global.DB.Table("articles").
		Select("articles.id as Id, author, username, avatar, title, `create`, `update`").
		Joins("LEFT JOIN users ON articles.author = users.id").
		Order("`create` desc").
		Scan(&articles).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}
	return articles, nil
}

func (ArticleService) GetArticleByAuthor(c *gin.Context) ([]model.ArticleDTO, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return nil, errors.New("权限不足")
	}

	var articles []model.ArticleDTO
	err = global.DB.Table("articles").
		Select("articles.id as Id, author, username, avatar, title, `create`, `update`").
		Joins("LEFT JOIN users ON articles.author = users.id").
		Order("`create` desc").
		Where("articles.author = ?", userClaims.Id).
		Scan(&articles).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}
	return articles, nil
}

func (ArticleService) UpdateArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return errors.New("权限不足")
	}
	var article model.Article
	err = global.DB.Where("id = ?", c.PostForm("id")).First(&article).Error
	if err != nil {
		return errors.New("未查询到该文章")
	}

	if userClaims.Id != article.Author && userClaims.Power == 1 {
		return errors.New("没有权限修改该文章")
	}

	return global.DB.Model(&article).Updates(model.Article{
		Title:   c.PostForm("title"),
		Content: c.PostForm("content"),
		Update:  time.Now(),
	}).Error
}

func (ArticleService) ArticleCount(c *gin.Context) (int64, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return 0, errors.New("权限不足")
	}
	var count int64
	err = global.DB.Model(&model.Article{}).Count(&count).Error
	if err != nil {
		return 0, errors.New("查询文章数失败")
	}
	return count, nil
}
