package service

import (
	"backend/global"
	"backend/model"
	"github.com/gin-gonic/gin"
	"os"
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

func (ImageService) DeleteImage(c *gin.Context) error {
	var image model.Image
	err := global.DB.Find(&image, c.Query("id")).Error
	if err != nil {
		return err
	}
	err = os.Remove("./image/" + image.Name)
	if err != nil {
		return err
	}
	return global.DB.Unscoped().Delete(&image, c.Query("id")).Error
}

func (ImageService) GetSpecifiedImage(c *gin.Context) ([]model.Image, error) {
	var images []model.Image
	return images, global.DB.Where("belong = ?", c.Query("belong")).Find(&images).Error
}
