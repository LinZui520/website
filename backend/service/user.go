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
	nickname := c.PostForm("nickname")
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
		Nickname: nickname,
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
	token, err := GenerateToken(username, password)
	if err != nil {
		return "", errors.New("生成token错误")
	}
	return token, nil
}

func (UserService) UserTokenLogin(c *gin.Context) (model.User, error) {
	var user model.User
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil {
		return user, err
	}
	username := userClaims.Username
	password := userClaims.Password
	err = global.DB.Where("username = ?", username).Find(&user).Error
	if err != nil {
		return user, errors.New("查询数据库错误")
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return user, errors.New("密码错误")
	}
	return user, nil
}

func (UserService) UserInfo(c *gin.Context) (model.User, error) {
	var user model.User

	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Username != c.Query("username") {
		return user, errors.New("用户权限不足")
	}
	return user, global.DB.Where("username = ?", c.Query("username")).Find(&user).Error
}

func (UserService) GetUser(c *gin.Context) (model.User, error) {
	var user model.User
	return user, global.DB.Where("id = ?", c.Query("id")).Find(&user).Error
}
