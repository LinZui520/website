package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"os"
	"server/global"
	"server/model"
	"strconv"
	"time"
)

type ImageService struct{}

func (ImageService) UploadImage(c *gin.Context) (model.Image, error) {
	var image model.Image

	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return image, errors.New("权限不足")
	}

	file, err := c.FormFile("image")
	if err != nil {
		return image, errors.New("图片读取失败")
	}
	name := strconv.FormatInt(time.Now().UnixNano(), 16) + ".png"
	directory := global.Config.System.Directory
	err = c.SaveUploadedFile(file, directory+name)
	if err != nil {
		return image, errors.New("图片保存失败")
	}
	image.Author = userClaims.Id
	image.Filename = name
	image.Create = time.Now()
	return image, global.DB.Create(&image).Error
}

func (ImageService) GetImagesByAuthor(c *gin.Context) ([]model.Image, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return nil, errors.New("权限不足")
	}

	var images []model.Image
	if userClaims.Power > 1 {
		return images, global.DB.Find(&images).Error
	}
	return images, global.DB.Where("author = ?", userClaims.Id).Find(&images).Error
}

func (ImageService) DeleteImage(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return errors.New("权限不足")
	}

	var image model.Image
	err = global.DB.Where("id = ?", c.Query("id")).First(&image).Error
	if err != nil {
		return errors.New("未查询到该图片")
	}
	err = os.Remove(global.Config.System.Directory + image.Filename)
	if err != nil {
		return errors.New("图片删除失败")
	}
	return global.DB.Where("id = ?", image.Id).Delete(&image).Error
}
