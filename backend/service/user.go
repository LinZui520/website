package service

import (
	"backend/global"
	"backend/model"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
)

type UserService struct {
}

func (service UserService) UserGet(c *gin.Context) model.User {
	var user model.User
	fmt.Println(c.Query("username"))
	global.DB.Find(&user, "username=?", c.Query("username"))
	return user
}

func (service UserService) UserAdd(c *gin.Context) {
	id, _ := strconv.Atoi(c.PostForm("id"))
	user := model.User{
		ID:       id,
		Username: c.PostForm("username"),
		Password: c.PostForm("password"),
	}
	err := global.DB.Create(&user).Error
	if err != nil {
		global.Log.Warnln(fmt.Sprintln("添加用户失败"))
	}
}
