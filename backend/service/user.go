package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
)

type UserService struct{}

func (service UserService) GetUser(c *gin.Context) (model.User, error) {
	var user model.User
	return user, global.DB.Find(&user, "username=?", c.Query("username")).Error
}

func (service UserService) AddUser(c *gin.Context) error {
	user := model.User{
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
	}
	return global.DB.Create(&user).Error
}
