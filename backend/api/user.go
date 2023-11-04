package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type UserApi struct{}

var userService service.UserService

func (UserApi) GetUser(c *gin.Context) {
	user, err := userService.GetUser(c)
	if err != nil {
		model.Fail(map[string]string{}, "查询失败", c)
	} else if user.Username == "" {
		model.Fail(map[string]string{}, "未查询到该用户", c)
	} else {
		model.OK(user, "查询成功", c)
	}

}

func (UserApi) AddUser(c *gin.Context) {
	err := userService.AddUser(c)
	if err != nil {
		model.Fail(map[string]string{}, "添加失败", c)
	} else {
		model.OK(map[string]string{}, "添加成功", c)
	}
}
