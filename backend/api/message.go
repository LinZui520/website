package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type MessageApi struct{}

var messageService service.MessageService

func (MessageApi) AddMessage(c *gin.Context) {
	err := messageService.AddMessage(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "留言成功", c)
	}
}

func (MessageApi) GetAllMessage(c *gin.Context) {
	list, err := messageService.GetAllMessage()
	if err != nil {
		model.Fail(struct{}{}, "查询失败", c)
	} else if len(list) == 0 {
		model.Fail(list, "未查询到任何留言", c)
	} else {
		model.OK(list, "查询成功", c)
	}
}
