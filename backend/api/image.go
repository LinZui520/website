package api

import (
	"backend/model"
	"backend/service"
	"github.com/gin-gonic/gin"
)

type ImageApi struct{}

var imageService service.ImageService

func (ImageApi) GetImage(c *gin.Context) {
	image, err := imageService.GetImage(c)
	if err != nil {
		model.Fail(map[string]string{}, "图片获取失败", c)
	} else {
		model.OK(image, "图片获取成功", c)
	}
}
