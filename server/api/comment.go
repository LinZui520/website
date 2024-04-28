package api

import (
	"github.com/gin-gonic/gin"
	"server/model"
	"server/service"
)

type CommentApi struct{}

var commentService service.CommentService

func (CommentApi) AddComment(c *gin.Context) {
	err := commentService.AddComment(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "评论成功", c)
	}
}

func (CommentApi) DeleteComment(c *gin.Context) {
	err := commentService.DeleteComment(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "删除成功", c)
	}
}

func (CommentApi) GetCommentsByArticle(c *gin.Context) {
	comments, err := commentService.GetCommentsByArticle(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(comments, "获取成功", c)
	}
}

func (CommentApi) GetCommentsByUser(c *gin.Context) {
	comments, err := commentService.GetCommentsByUser(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(comments, "获取成功", c)
	}
}

func (CommentApi) GetComments(c *gin.Context) {
	comments, err := commentService.GetComments(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(comments, "获取成功", c)
	}
}
