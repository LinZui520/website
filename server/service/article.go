package service

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"server/global"
	"server/model"
	"time"
)

type ArticleService struct{}

const articlesCacheKey = "articles"

func (ArticleService) AddArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	article := model.Article{
		Author:  userClaims.Id,
		Title:   c.PostForm("title"),
		Content: c.PostForm("content"),
		Create:  time.Now(),
		Update:  time.Now(),
	}
	if global.DB.Create(&article).Error != nil {
		return errors.New("添加失败")
	}

	err = global.Redis.Del(articlesCacheKey).Err()
	if err != nil {
		global.Log.Warnln("Redis 删除文章缓存失败:", err)
	}

	return nil
}

func (ArticleService) DeleteArticle(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	var article model.Article
	err = global.DB.Where("id = ?", c.Query("id")).First(&article).Error
	if err != nil {
		return errors.New("未查询到该文章")
	}

	if userClaims.Id != article.Author && userClaims.Power <= 0 {
		return errors.New("没有权限删除该文章")
	}

	if global.DB.Where("id = ?", article.Id).Delete(&article).Error != nil {
		return errors.New("删除失败")
	}

	err = global.Redis.Del(articlesCacheKey).Err()
	if err != nil {
		global.Log.Warnln("Redis 删除文章缓存失败:", err)
	}

	return nil
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

	cachedArticles, err := global.Redis.Get(articlesCacheKey).Result()
	if err == nil {
		err = json.Unmarshal([]byte(cachedArticles), &articles)
		if err == nil {
			global.Log.Infoln("Redis 缓存文章数据获取成功")
			return articles, nil
		} else {
			global.Log.Warnln("Redis 缓存文章数据解析失败:", err)
		}
	}

	err = global.DB.Table("articles").
		Select("articles.id as Id, author, username, avatar, title, content, `create`, `update`").
		Joins("LEFT JOIN users ON articles.author = users.id").
		Order("`create` desc").
		Scan(&articles).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}

	serializedArticles, err := json.Marshal(articles)
	if err != nil {
		global.Log.Warnln("Redis 文章数据序列化失败:", err)
	}
	err = global.Redis.Set(articlesCacheKey, serializedArticles, 10*time.Minute).Err()
	if err != nil {
		global.Log.Warnln("Redis 存储文章失败:", err)
	}

	return articles, nil
}

func (ArticleService) GetArticlesById(c *gin.Context) ([]model.ArticleDTO, error) {
	var articles []model.ArticleDTO
	err := global.DB.Table("articles").
		Select("articles.id as Id, author, username, avatar, title, `create`, `update`").
		Joins("LEFT JOIN users ON articles.author = users.id").
		Where("articles.author = ?", c.Query("id")).
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
	if err != nil || userClaims.Power < 0 {
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
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}
	var article model.Article
	err = global.DB.Where("id = ?", c.PostForm("id")).First(&article).Error
	if err != nil {
		return errors.New("未查询到该文章")
	}

	if userClaims.Id != article.Author && userClaims.Power <= 0 {
		return errors.New("没有权限修改该文章")
	}

	if global.DB.Model(&article).Updates(model.Article{
		Title:   c.PostForm("title"),
		Content: c.PostForm("content"),
		Update:  time.Now(),
	}).Error != nil {
		return errors.New("修改文章失败")
	}

	err = global.Redis.Del(articlesCacheKey).Err()
	if err != nil {
		global.Log.Warnln("Redis 删除文章缓存失败:", err)
	}

	return nil
}

func (ArticleService) ArticleCount(c *gin.Context) (int64, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return 0, errors.New("权限不足")
	}
	var count int64
	err = global.DB.Model(&model.Article{}).Count(&count).Error
	if err != nil {
		return 0, errors.New("查询文章数失败")
	}
	return count, nil
}
