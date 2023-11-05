package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

type ImageService struct{}

func (ImageService) AddImage(c *gin.Context) error {
	belong, _ := strconv.Atoi(c.PostForm("belong"))
	file, _ := c.FormFile("image")
	name := strconv.FormatInt(time.Now().Unix(), 10) + ".jpg"
	err := c.SaveUploadedFile(file, "./image/"+name)
	if err != nil {
		return err
	}
	image := model.Image{
		Name:   name,
		Belong: belong,
	}
	return global.DB.Create(&image).Error
}
