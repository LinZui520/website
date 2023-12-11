package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
)

type AdminService struct{}

func (AdminService) GetCount(c *gin.Context) (interface{}, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power == 0 {
		return nil, err
	}

	var CountOfUser, CountOfArticle, CountOfMessage int64
	ErrOfUser := global.DB.Model(&model.User{}).Count(&CountOfUser).Error
	ErrOfArticle := global.DB.Model(&model.Article{}).Count(&CountOfArticle).Error
	ErrOfMessage := global.DB.Model(&model.Message{}).Count(&CountOfMessage).Error
	if ErrOfUser != nil && ErrOfArticle != nil && ErrOfMessage != nil {
		return nil, err
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
