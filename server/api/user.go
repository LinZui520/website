package api

import (
	"github.com/gin-gonic/gin"
	"server/model"
	"server/service"
)

type UserApi struct{}

var userService service.UserService

func (UserApi) UserVerify(c *gin.Context) {
	err := userService.UserVerify(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "验证码发送成功", c)
	}
}

func (UserApi) UserRegister(c *gin.Context) {
	err := userService.UserRegister(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "注册成功", c)
	}
}

func (UserApi) UserLogin(c *gin.Context) {
	data, err := userService.UserLogin(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "登录成功", c)
	}
}

func (UserApi) UserTokenLogin(c *gin.Context) {
	data, err := userService.UserTokenLogin(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "登录成功", c)
	}
}

func (UserApi) UserEmailLogin(c *gin.Context) {
	data, err := userService.UserEmailLogin(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "登录成功", c)
	}
}
