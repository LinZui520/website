package service

import (
	"backend/global"
	"backend/model"
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type UserService struct{}

func (UserService) UserRegister(c *gin.Context) error {
	nickname := c.PostForm("nickname")
	username := c.PostForm("username")
	password := c.PostForm("password")
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	user := model.User{
		Nickname: nickname,
		Username: username,
		Password: string(hash),
		Power:    0,
		Creation: time.Now(),
		Latest:   time.Now(),
	}
	return global.DB.Create(&user).Error
}

func (UserService) UserLogin(c *gin.Context) (interface{}, error) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	var user model.User
	global.DB.Where("username = ?", username).First(&user)

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return struct{}{}, errors.New("账号或密码错误")
	}

	tokenString, err := GenerateToken(user.ID, user.Username, user.Password, user.Power)
	if err != nil {
		return struct{}{}, errors.New("生成token错误")
	}
	global.DB.Model(&user).Update("latest", time.Now())
	return struct {
		User  model.User `json:"user"`
		Token string     `json:"token"`
	}{
		User:  user,
		Token: tokenString,
	}, nil
}

func (UserService) UserTokenLogin(c *gin.Context) (interface{}, error) {
	var user model.User
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil {
		return nil, errors.New("权限不足")
	}
	username := userClaims.Username
	password := userClaims.Password
	global.DB.Where("username = ?", username).First(&user)
	if user.Password != password {
		return struct{}{}, errors.New("密码错误")
	}
	tokenString, err = GenerateToken(user.ID, user.Username, user.Password, user.Power)
	if err != nil {
		return struct{}{}, errors.New("生成token错误")
	}
	global.DB.Model(&user).Update("latest", time.Now())
	return struct {
		User  model.User `json:"user"`
		Token string     `json:"token"`
	}{
		User:  user,
		Token: tokenString,
	}, nil
}

func (UserService) GetAllUser(c *gin.Context) ([]model.User, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power == 0 {
		return nil, errors.New("权限不足")
	}

	var users []model.User
	err = global.DB.Find(&users).Error
	if err != nil {
		return nil, errors.New("查询用户列表失败")
	}
	return users, nil
}
