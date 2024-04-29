package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"server/global"
	"server/model"
	"strconv"
	"time"
)

type CommentService struct{}

func (CommentService) AddComment(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	article, err := strconv.Atoi(c.PostForm("article"))
	if err != nil {
		return err
	}
	comment := model.Comment{
		Author:  userClaims.Id,
		Article: article,
		Content: c.PostForm("content"),
		Create:  time.Now(),
	}

	return global.DB.Create(&comment).Error
}

func (CommentService) DeleteComment(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	var comment model.Comment
	err = global.DB.Where("id = ?", c.Query("id")).First(&comment).Error
	if err != nil {
		return errors.New("未查询到该评论")
	}

	if userClaims.Id != comment.Author && userClaims.Power <= 0 {
		return errors.New("没有权限删除该评论")
	}

	return global.DB.Where("id = ?", comment.Id).Delete(&comment).Error
}

func (CommentService) GetCommentsByArticle(c *gin.Context) ([]model.CommentDTO, error) {
	var comments []model.CommentDTO

	err := global.DB.Table("comments").
		Select("comments.id as Id, comments.author as Author, username, avatar, article, title, comments.content as Content, comments.create as `Create`").
		Joins("LEFT JOIN users ON comments.author = users.id").
		Joins("LEFT JOIN articles ON comments.article = articles.id").
		Where("comments.article = ?", c.Query("id")).
		Order("comments.create desc").
		Scan(&comments).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}

	return comments, nil
}

func (CommentService) GetCommentsByUser(c *gin.Context) ([]model.CommentDTO, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return nil, errors.New("权限不足")
	}

	var comments []model.CommentDTO

	err = global.DB.Table("comments").
		Select("comments.id as Id, comments.author as Author, username, avatar, article, title, comments.content as Content, comments.create as `Create`").
		Joins("LEFT JOIN users ON comments.author = users.id").
		Joins("LEFT JOIN articles ON comments.article = articles.id").
		Where("comments.author = ?", userClaims.Id).
		Order("comments.create desc").
		Scan(&comments).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}

	return comments, nil
}

func (CommentService) GetComments(c *gin.Context) ([]model.CommentDTO, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return nil, errors.New("权限不足")
	}

	var comments []model.CommentDTO

	err = global.DB.Table("comments").
		Select("comments.id as Id, comments.author as Author, username, avatar, article, title, comments.content as Content, comments.create as `Create`").
		Joins("LEFT JOIN users ON comments.author = users.id").
		Joins("LEFT JOIN articles ON comments.article = articles.id").
		Order("comments.create desc").
		Scan(&comments).Error
	if err != nil {
		return nil, errors.New("查询文章失败")
	}

	return comments, nil
}
