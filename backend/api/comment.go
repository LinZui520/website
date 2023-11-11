package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type CommentApi struct{}

var commentService service.CommentService

func (CommentApi) AddComment(c *gin.Context) {
	err := commentService.AddComment(c)
	if err != nil {
		model.Fail(map[string]string{}, "留言添加失败", c)
	} else {
		model.OK(map[string]string{}, "留言添加成功", c)
	}
}

func (CommentApi) GetAllComment(c *gin.Context) {
	comments, err := commentService.GetAllComment()
	if err != nil {
		model.Fail(map[string]string{}, "查询失败", c)
	} else if len(comments) == 0 {
		model.Fail(map[string]string{}, "未查询到任何留言", c)
	} else {
		model.OK(comments, "查询成功", c)
	}
}
