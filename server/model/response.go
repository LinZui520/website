package model

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Response struct {
	Code    int    `json:"code"`
	Data    any    `json:"data"`
	Message string `json:"message"`
}

const (
	Success = 200
	Error   = 400
)

func Result(code int, data any, msg string, c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Data:    data,
		Message: msg,
	})
}

func OK(data any, message string, c *gin.Context) {
	Result(Success, data, message, c)
}

func Fail(data any, message string, c *gin.Context) {
	Result(Error, data, message, c)
}
