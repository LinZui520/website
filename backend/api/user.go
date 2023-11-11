package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type UserApi struct{}

var userService service.UserService

func (UserApi) UserRegister(c *gin.Context) {
	err := userService.UserRegister(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "注册成功", c)
	}
}

func (UserApi) UserLogin(c *gin.Context) {
	tokenString, err := userService.UserLogin(c)
	if err != nil {
		model.Fail(tokenString, err.Error(), c)
	} else {
		model.OK(tokenString, "登陆成功", c)
	}
}

func (UserApi) UserTokenLogin(c *gin.Context) {
	user, err := userService.UserTokenLogin(c)
	if err != nil {
		model.Fail(user, err.Error(), c)
	} else {
		model.OK(user, "登陆成功", c)
	}
}

func (UserApi) UserInfo(c *gin.Context) {
	user, err := userService.UserInfo(c)
	if err != nil {
		model.Fail(nil, err.Error(), c)
	} else if user.ID == 0 {
		model.Fail(nil, "未查询到该用户", c)
	} else {
		model.OK(user, "查询成功", c)
	}
}
