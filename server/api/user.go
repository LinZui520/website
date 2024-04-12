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

func (UserApi) GetAllUser(c *gin.Context) {
	data, err := userService.GetAllUser(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "查询成功", c)
	}
}

func (UserApi) BlockUser(c *gin.Context) {
	err := userService.BlockUser(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "封禁成功", c)
	}
}

func (UserApi) BoostUser(c *gin.Context) {
	err := userService.BoostUser(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "提升成功", c)
	}
}

func (UserApi) UserSecurity(c *gin.Context) {
	err := userService.UserSecurity(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "更新成功", c)
	}
}

func (UserApi) UploadAvatar(c *gin.Context) {
	filename, err := userService.UploadAvatar(c)
	if err != nil {
		model.Fail("", err.Error(), c)
	} else {
		model.OK(filename, "更新成功", c)
	}
}

func (UserApi) UserCount(c *gin.Context) {
	data, err := userService.UserCount(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "查询成功", c)
	}
}

func (UserApi) UpdateUsername(c *gin.Context) {
	err := userService.UpdateUsername(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "更新成功", c)
	}
}

func (UserApi) GetUserInfo(c *gin.Context) {
	data, err := userService.GetUserInfo(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "查询成功", c)
	}
}
