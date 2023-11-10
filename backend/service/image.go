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

func AddImage(c *gin.Context) (int, error) {
	file, _ := c.FormFile("image")
	name := strconv.FormatInt(time.Now().Unix(), 10) + ".png"
	directory := global.Config.System.Directory + "image/"
	err := c.SaveUploadedFile(file, directory+name)
	if err != nil {
		return -1, errors.New("图片保存失败")
	}
	url := global.Config.System.Router + name
	image := model.Image{
		URL: url,
	}
	err = global.DB.Create(&image).Error
	if err != nil {
		_ = os.Remove(global.Config.System.Directory + "image/" + name)
		return -1, errors.New("图片基本数据保存数据库失败")
	}
	return image.ID, nil
}

func GetImageURL(id int) (model.Image, error) {
	var image model.Image
	return image, global.DB.Where("id = ?", id).Find(&image).Error
}

func (ImageService) GetImage(c *gin.Context) (model.Image, error) {
	var image model.Image
	return image, global.DB.Where("id = ?", c.Query("id")).Find(&image).Error
}

//func DeleteImage(c *gin.Context) {
//
//}
