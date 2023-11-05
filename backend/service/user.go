package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
)

type UserService struct{}

func (UserService) GetUser(c *gin.Context) (model.User, error) {
	var user model.User
	return user, global.DB.Find(&user, "username=?", c.Query("username")).Error
}

func (UserService) AddUser(c *gin.Context) error {
	user := model.User{
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
	}
	return global.DB.Create(&user).Error
}

func (UserService) UserLogin(c *gin.Context) (bool, error) {
	var user model.User
	err := global.DB.Where("username = ?", c.PostForm("username")).Find(&user).Error
	return user.Password == c.PostForm("password"), err
}
