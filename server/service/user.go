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

func (UserService) UserLogin(c *gin.Context) (model.UserDTO, error) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	var user model.User
	global.DB.Where("username = ?", username).First(&user)

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return model.UserDTO{}, errors.New("账号或密码错误")
	}

	tokenString, err := GenerateToken(user.Id, user.Username, user.Password, user.Power)
	if err != nil {
		return model.UserDTO{}, errors.New("生成token错误")
	}
	avatar, err := GetImage(user.Avatar)
	if err != nil {
		return model.UserDTO{}, errors.New("获取头像失败")
	}
	global.DB.Model(&user).Update("login", time.Now())
	return model.UserDTO{
		Id:          user.Id,
		Avatar:      avatar.Filename,
		Username:    user.Username,
		Email:       user.Email,
		Power:       user.Power,
		TokenString: tokenString,
	}, nil
}

func (UserService) UserTokenLogin(c *gin.Context) (model.UserDTO, error) {
	var user model.User
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil {
		return model.UserDTO{}, errors.New("token解析失败")
	}
	username := userClaims.Username
	password := userClaims.Password
	global.DB.Where("username = ?", username).First(&user)
	if user.Password != password {
		return model.UserDTO{}, errors.New("密码错误")
	}
	tokenString, err = GenerateToken(user.Id, user.Username, user.Password, user.Power)
	if err != nil {
		return model.UserDTO{}, errors.New("生成token错误")
	}
	avatar, err := GetImage(user.Avatar)
	if err != nil {
		return model.UserDTO{}, errors.New("获取头像失败")
	}
	global.DB.Model(&user).Update("login", time.Now())
	return model.UserDTO{
		Id:          user.Id,
		Avatar:      avatar.Filename,
		Username:    user.Username,
		Email:       user.Email,
		Power:       user.Power,
		TokenString: tokenString,
	}, nil
}

func (UserService) UserEmailLogin(c *gin.Context) (model.UserDTO, error) {
	email := c.PostForm("email")
	code := c.PostForm("code")
	cachedCode, err := global.Redis.Get(email).Result()
	if err != nil {
		return model.UserDTO{}, errors.New("该邮箱未发送验证码或验证码已过期")
	}
	if code != cachedCode {
		return model.UserDTO{}, errors.New("验证码错误")
	}
	var user model.User
	global.DB.Where("email = ?", email).First(&user)
	tokenString, err := GenerateToken(user.Id, user.Username, user.Password, user.Power)
	if err != nil {
		return model.UserDTO{}, errors.New("生成token错误")
	}
	avatar, err := GetImage(user.Avatar)
	if err != nil {
		return model.UserDTO{}, errors.New("获取头像失败")
	}
	global.DB.Model(&user).Update("login", time.Now())
	return model.UserDTO{
		Id:          user.Id,
		Avatar:      avatar.Filename,
		Username:    user.Username,
		Email:       user.Email,
		Power:       user.Power,
		TokenString: tokenString,
	}, nil
}
