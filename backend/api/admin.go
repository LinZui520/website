package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type AdminApi struct{}

var adminService service.AdminService

func (AdminApi) GetCount(c *gin.Context) {
	data, err := adminService.GetCount(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "查询成功", c)
	}
}
