package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type ImageApi struct{}

var imageService service.ImageService

func (ImageApi) AddImage(c *gin.Context) {
	err := imageService.AddImage(c)
	if err != nil {
		model.Fail(map[string]string{}, "添加失败", c)
	} else {
		model.OK(map[string]string{}, "添加成功", c)
	}
}

func (ImageApi) DeleteImage(c *gin.Context) {
	err := imageService.DeleteImage(c)
	if err != nil {
		model.Fail(map[string]string{}, "删除失败", c)
	} else {
		model.OK(map[string]string{}, "删除成功", c)
	}
}

func (ImageApi) GetSpecifiedImage(c *gin.Context) {
	images, err := imageService.GetSpecifiedImage(c)
	if err != nil {
		model.Fail(map[string]string{}, "查询失败", c)
	} else if images == nil {
		model.Fail(map[string]string{}, "未查询到图片", c)
	} else {
		model.OK(images, "查询成功", c)
	}
}
