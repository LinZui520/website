package api

import (
	"github.com/gin-gonic/gin"
	"server/model"
	"server/service"
)

type ImageApi struct{}

var imageService service.ImageService

func (ImageApi) UploadImage(c *gin.Context) {
	data, err := imageService.UploadImage(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "上传成功", c)
	}
}

func (ImageApi) GetAllImage(c *gin.Context) {
	data, err := imageService.GetAllImage(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "获取成功", c)
	}
}

func (ImageApi) GetImageByAuthor(c *gin.Context) {
	data, err := imageService.GetImageByAuthor(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "获取成功", c)
	}
}

func (ImageApi) DeleteImage(c *gin.Context) {
	err := imageService.DeleteImage(c)
	if err != nil {
		model.Fail(false, err.Error(), c)
	} else {
		model.OK(true, "删除成功", c)
	}
}

func (ImageApi) ImageCount(c *gin.Context) {
	data, err := imageService.ImageCount(c)
	if err != nil {
		model.Fail(data, err.Error(), c)
	} else {
		model.OK(data, "查询成功", c)
	}
}
