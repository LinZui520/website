package model

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

//type ErrorCode int
//
//const (
//	SettingsError ErrorCode = 1001
//)
//
//var (
//	ErrorMap = map[ErrorCode]string{
//		SettingsError: "系统错误",
//	}
//)

type Response struct {
	Code int    `json:"code"`
	Data any    `json:"data"`
	Msg  string `json:"msg"`
}

const (
	Success = 200
	Error   = 400
)

func Result(code int, data any, msg string, c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Code: code,
		Data: data,
		Msg:  msg,
	})
}

func OK(data any, msg string, c *gin.Context) {
	Result(Success, data, msg, c)
}

func Fail(data any, msg string, c *gin.Context) {
	Result(Error, data, msg, c)
}
