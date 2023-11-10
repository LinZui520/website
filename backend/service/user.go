package service

import (
	"backend/global"
	"backend/model"
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct{}

func findUsername(username string) (bool, error) {
	var user model.User
	return user.Username != "", global.DB.Find(&user, "username=?", username).Error
}

func (UserService) UserRegister(c *gin.Context) error {
	username := c.PostForm("username")
	password := c.PostForm("password")
	hasUsername, err := findUsername(username)
	if err != nil {
		return errors.New("系统内部错误")
	}
	if hasUsername == true {
		return errors.New("用户名已存在")
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	user := model.User{
		Username: username,
		Password: string(hash),
	}
	if global.DB.Create(&user).Error != nil {
		return errors.New("系统内部错误")
	}
	return nil
}

func (UserService) UserLogin(c *gin.Context) (string, error) {
	username := c.PostForm("username")
	password := c.PostForm("password")
	hasUsername, err := findUsername(username)
	if err != nil {
		return "", errors.New("查询数据库错误")
	}
	if hasUsername == false {
		return "", errors.New("用户名不存在")
	}
	var user model.User
	err = global.DB.Where("username = ?", username).Find(&user).Error
	if err != nil {
		return "", errors.New("查询数据库错误")
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return "", errors.New("密码错误")
	}
	token, err := GenerateToken(username)
	if err != nil {
		return "", errors.New("生成token错误")
	}
	return token, nil
}
