package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"server/global"
	"server/model"
	"time"
)

type UserService struct{}

func (UserService) UserVerify(c *gin.Context) error {
	email := c.Query("email")
	cachedCode, err := global.Redis.Get(email).Result()
	if err == nil && cachedCode != "" {
		return errors.New("该邮箱已发送验证码，请勿重复发送")
	}
	code, err := GenerateRandomCode(6)
	if err != nil {
		return errors.New("生成验证码失败")
	}
	err = SendVerificationEmail(email, code)
	if err != nil {
		return errors.New("发送验证码失败")
	}

	err = global.Redis.Set(email, code, 5*time.Minute).Err()
	if err != nil {
		return errors.New("验证码存入Redis失败")
	}
	return nil
}

func (UserService) UserRegister(c *gin.Context) error {
	email := c.PostForm("email")
	code := c.PostForm("code")
	cachedCode, err := global.Redis.Get(email).Result()
	if err != nil {
		return errors.New("该邮箱未发送验证码或验证码已过期")
	}
	if code != cachedCode {
		return errors.New("验证码错误")
	}
	username := c.PostForm("username")
	password := c.PostForm("password")
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	user := model.User{
		Avatar:   100000,
		Username: username,
		Email:    email,
		Password: string(hash),
		Power:    0,
		Register: time.Now(),
		Login:    time.Now(),
	}
	return global.DB.Create(&user).Error
}
