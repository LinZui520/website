package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
	"os"
	"strconv"
	"strings"
	"time"
)

type ArticleService struct{}

func (ArticleService) AddArticle(c *gin.Context) error {
	file, _ := c.FormFile("image")
	image := strconv.FormatInt(time.Now().Unix(), 10) + ".png"
	err := c.SaveUploadedFile(file, "./image/"+image)
	image = global.Config.System.Router + image
	if err != nil {
		return err
	}
	article := model.Article{
		Title:   c.PostForm("title"),
		Image:   image,
		Content: c.PostForm("content"),
	}
	return global.DB.Create(&article).Error
}

func (ArticleService) GetOneArticle(c *gin.Context) (model.Article, error) {
	var article model.Article
	tokenString, _ := c.Cookie("token")
	_, err := ParseToken(tokenString)
	if err != nil {
		return article, err
	}
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
	var articleService ArticleService
	Article, _ := articleService.GetOneArticle(c)
	image := strings.Split(Article.Image, global.Config.System.Router)[1]
	err := os.Remove(global.Config.System.Directory + "image/" + image)
	if err != nil {
		global.Log.Warnln("图片删除失败")
	}
	var article model.Article
	return global.DB.Unscoped().Delete(&article, c.Query("id")).Error
}

func (ArticleService) UpdateArticle(c *gin.Context) error {
	var article model.Article
	return global.DB.Model(&article).Where("id = ?", c.PostForm("id")).Update("title", c.PostForm("title")).Update("image", c.PostForm("image")).Update("content", c.PostForm("content")).Error
}
