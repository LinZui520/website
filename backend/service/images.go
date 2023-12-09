package service

import (
	"backend/global"
	"backend/model"
	"errors"
	"github.com/gin-gonic/gin"
	"os"
	"strconv"
	"time"
)

type ImageService struct{}

func AddImage(c *gin.Context) (model.Image, error) {
	file, _ := c.FormFile("image")
	name := strconv.FormatInt(time.Now().UnixNano(), 16) + ".png"
	directory := global.Config.System.Directory
	err := c.SaveUploadedFile(file, directory+name)
	var image model.Image
	if err != nil {
		return image, errors.New("图片保存失败")
	}
	image.FileName = name
	image.Creation = time.Now()
	return image, global.DB.Create(&image).Error
}

func GetImage(id int) (model.Image, error) {
	var image model.Image
	return image, global.DB.Where("id = ?", id).First(&image).Error
}

func DeleteImage(id int) error {
	image, _ := GetImage(id)
	err := global.DB.Where("id = ?", id).Delete(&image).Error
	if err != nil {
		return errors.New("图片删除失败")
	}
	return os.Remove(global.Config.System.Directory + image.FileName)
}
