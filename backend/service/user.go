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

	token, err := GenerateToken(user.ID, user.Username, user.Password, user.Power)
	if err != nil {
		return struct{}{}, errors.New("生成token错误")
	}
	global.DB.Model(&user).Update("latest", time.Now())
	return struct {
		User  model.User
		Token string
	}{
		User:  user,
		Token: token,
	}, nil
}

func (UserService) UserTokenLogin(c *gin.Context) (interface{}, error) {
	var user model.User
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil {
		return struct{}{}, err
	}
	username := userClaims.Username
	password := userClaims.Password
	global.DB.Where("username = ?", username).First(&user)
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return struct{}{}, errors.New("密码错误")
	}
	tokenString, err = GenerateToken(user.ID, user.Username, user.Password, user.Power)
	if err != nil {
		return struct{}{}, errors.New("生成token错误")
	}
	global.DB.Model(&user).Update("latest", time.Now())
	return struct {
		User  model.User
		Token string
	}{
		User:  user,
		Token: tokenString,
	}, nil
}

func GetUserInfo(id int) (model.User, error) {
	var user model.User
	return user, global.DB.Where("id = ?", id).First(&user).Error
}
