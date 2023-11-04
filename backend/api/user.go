package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type UserApi struct {
}

var userService service.UserService

func (UserApi) UserGet(c *gin.Context) {
	user := userService.UserGet(c)
	model.Fail(1001, user, "你好", c)
}

func (UserApi) UserAdd(c *gin.Context) {
	userService.UserAdd(c)
	model.OK(map[string]string{}, "xxx", c)
}
