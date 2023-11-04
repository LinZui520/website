package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
)

type UserService struct {
}

func (service UserService) UserGet(c *gin.Context) (model.User, error) {
	var user model.User
	err := global.DB.Find(&user, "username=?", c.Query("username")).Error
	return user, err
}

func (service UserService) UserAdd(c *gin.Context) error {
	user := model.User{
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
	}
	return global.DB.Create(&user).Error
}
