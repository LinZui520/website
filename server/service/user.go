package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"server/global"
	"server/model"
	"strconv"
	"time"
)

type UserService struct{}

func (UserService) UserVerify(c *gin.Context) error {
	email := c.PostForm("email")
	x, _ := strconv.Atoi(c.PostForm("x"))
	y, _ := strconv.Atoi(c.PostForm("y"))
	duration, _ := strconv.Atoi(c.PostForm("duration"))
	if x != 260 || y == 0 || duration <= 100 {
		return errors.New("我一眼就看出你不是人")
	}
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
		Avatar:   "default.png",
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
	if user.Power < 0 {
		return model.UserDTO{}, errors.New("该账号已被封禁")
	}
	global.DB.Model(&user).Update("login", time.Now())
	return model.UserDTO{
		Id:          user.Id,
		Avatar:      user.Avatar,
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
	if user.Power < 0 {
		return model.UserDTO{}, errors.New("该账号已被封禁")
	}
	global.DB.Model(&user).Update("login", time.Now())
	return model.UserDTO{
		Id:          user.Id,
		Avatar:      user.Avatar,
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
	if user.Power < 0 {
		return model.UserDTO{}, errors.New("该账号已被封禁")
	}
	global.DB.Model(&user).Update("login", time.Now())
	return model.UserDTO{
		Id:          user.Id,
		Avatar:      user.Avatar,
		Username:    user.Username,
		Email:       user.Email,
		Power:       user.Power,
		TokenString: tokenString,
	}, nil
}

func (UserService) GetAllUser(c *gin.Context) ([]model.User, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return nil, errors.New("权限不足")
	}

	var users []model.User
	err = global.DB.Find(&users).Error
	if err != nil {
		return nil, errors.New("查询用户列表失败")
	}
	return users, nil
}

func (UserService) BlockUser(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 1 {
		return errors.New("权限不足")
	}

	var user model.User
	err = global.DB.Where("id = ?", c.Query("id")).First(&user).Error
	if err != nil {
		return errors.New("未查询到该用户")
	}
	if userClaims.Power <= user.Power {
		return errors.New("权限不足")
	}
	return global.DB.Model(&user).Update("power", -1).Error
}

func (UserService) BoostUser(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return errors.New("权限不足")
	}
	var user model.User
	err = global.DB.Where("id = ?", c.Query("id")).First(&user).Error
	if err != nil {
		return errors.New("未查询到该用户")
	}
	if userClaims.Power <= user.Power+1 {
		return errors.New("权限不足")
	}
	return global.DB.Model(&user).Update("power", user.Power+1).Error
}
