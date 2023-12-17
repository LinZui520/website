package service

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"server/model"
	"time"
)

const TokenExpireDuration = time.Hour * 24 * 7

var Secret = []byte("ZhuGui")

func GenerateToken(id int, username string, password string, power int) (string, error) {
	claims := model.UserClaims{
		Id:       id,
		Password: password,
		Username: username,
		Power:    power,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(TokenExpireDuration)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "LinZui",
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(Secret)
}

func ParseToken(tokenString string) (*model.UserClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &model.UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return Secret, nil
	})
	if err != nil {
		return nil, errors.New("无效令牌")
	}

	if !token.Valid {
		return nil, errors.New("无效令牌")
	}

	userClaims, ok := token.Claims.(*model.UserClaims)

	if !ok {
		return nil, errors.New("无效令牌类型")
	}
	return userClaims, nil
}
