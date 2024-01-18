package api

import (
	"github.com/gin-gonic/gin"
	"server/model"
	"server/service"
)

type MessageApi struct{}

var messageService service.MessageService

func (MessageApi) AddMessage(c *gin.Context) {
	err := messageService.AddMessage(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "添加成功", c)
	}
}

func (MessageApi) GetAllMessage(c *gin.Context) {
	list, err := messageService.GetAllMessage()
	if err != nil {
		model.Fail(struct{}{}, "查询失败", c)
	} else if len(list) == 0 {
		model.OK(list, "未查询到任何留言", c)
	} else {
		model.OK(list, "查询成功", c)
	}
}

func (MessageApi) DeleteMessage(c *gin.Context) {
	err := messageService.DeleteMessage(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "删除成功", c)
	}
}

func (MessageApi) GetMessageByAuthor(c *gin.Context) {
	data, err := messageService.GetMessageByAuthor(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "获取成功", c)
	}
}

func (MessageApi) MessageCount(c *gin.Context) {
	data, err := messageService.MessageCount(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "查询成功", c)
	}
}
