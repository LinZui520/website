package service

import (
	"backend/global"
	"backend/model"
	"errors"
	"github.com/gin-gonic/gin"
)

type AdminService struct{}

func (AdminService) GetCount(c *gin.Context) (interface{}, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power == 0 {
		return nil, errors.New("权限不足")
	}

	var CountOfUser, CountOfArticle, CountOfMessage int64
	ErrOfUser := global.DB.Model(&model.User{}).Count(&CountOfUser).Error
	ErrOfArticle := global.DB.Model(&model.Article{}).Count(&CountOfArticle).Error
	ErrOfMessage := global.DB.Model(&model.Message{}).Count(&CountOfMessage).Error
	if ErrOfUser != nil {
		return nil, ErrOfUser
	}
	if ErrOfArticle != nil {
		return nil, ErrOfArticle
	}
	if ErrOfMessage != nil {
		return nil, ErrOfMessage
	}
	return struct {
		User    int64 `json:"user"`
		Article int64 `json:"article"`
		Message int64 `json:"message"`
	}{
		User:    CountOfUser,
		Article: CountOfArticle,
		Message: CountOfMessage,
	}, nil
}
