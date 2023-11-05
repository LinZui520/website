package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
	"strconv"
)

type ImageService struct{}

func (ImageService) AddImage(c *gin.Context) error {
	belong, _ := strconv.Atoi(c.PostForm("belong"))
	file, _ := c.FormFile("image")
	err := c.SaveUploadedFile(file, "./image/"+c.PostForm("name"))
	if err != nil {
		return err
	}
	image := model.Image{
		Name:   c.PostForm("name"),
		Belong: belong,
	}
	return global.DB.Create(&image).Error
}
