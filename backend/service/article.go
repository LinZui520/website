package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
	"os"
	"strings"
)

type ArticleService struct{}

func (ArticleService) AddArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	_, err := ParseToken(tokenString)
	if err != nil {
		return err
	}
	ImageID, err := AddImage(c)
	if err != nil {
		return err
	}
	article := model.Article{
		Title:   c.PostForm("title"),
		Image:   ImageID,
		Content: c.PostForm("content"),
	}
	return global.DB.Create(&article).Error
}

func (ArticleService) GetOneArticle(c *gin.Context) (model.Article, error) {
	var article model.Article
	//tokenString, _ := c.Cookie("token")
	//_, err := ParseToken(tokenString)
	//if err != nil {
	//	return article, err
	//}
	return article, global.DB.Where("id = ?", c.Query("id")).Find(&article).Error
}

func (ArticleService) GetAllArticle() ([]model.Article, error) {
	var articles []model.Article
	//tokenString, _ := c.Cookie("token")
	//_, err := ParseToken(tokenString)
	//if err != nil {
	//	return articles, err
	//}

	return articles, global.DB.Find(&articles).Error
}

func (ArticleService) DeleteArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	_, err := ParseToken(tokenString)
	if err != nil {
		return err
	}

	var articleService ArticleService
	Article, _ := articleService.GetOneArticle(c)
	image, err := GetImageURL(Article.Image)
	if err != nil {
		return err
	}
	name := strings.Split(image.URL, global.Config.System.Router)[1]
	err = os.Remove(global.Config.System.Directory + "image/" + name)
	if err != nil {
		global.Log.Warnln("图片删除失败")
	}
	var article model.Article
	return global.DB.Unscoped().Delete(&article, c.Query("id")).Error
}

//func (ArticleService) UpdateArticle(c *gin.Context) error {
//	var article model.Article
//	return global.DB.Model(&article).Where("id = ?", c.PostForm("id")).Update("title", c.PostForm("title")).Update("image", c.PostForm("image")).Update("content", c.PostForm("content")).Error
//}
