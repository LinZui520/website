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
	var articles []model.Article
	err := global.DB.Find(&articles).Error
	if err != nil {
		return nil, errors.New("查询文章列表失败")
	}

	var list []model.ArticleList
	for _, article := range articles {
		image, _ := GetImage(article.Image)
		user, _ := GetUserInfo(article.Author)
		list = append(list, model.ArticleList{
			Article:        article,
			ImageFilename:  image.Filename,
			AuthorNickName: user.Nickname,
		})
	}
	return list, nil
}
