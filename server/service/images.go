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
	if err != nil || userClaims.Power < 0 {
		return image, errors.New("权限不足")
	}

	file, err := c.FormFile("image")
	if err != nil {
		return image, errors.New("图片读取失败")
	}
	filename := strconv.FormatInt(time.Now().UnixNano(), 16) + ".png"
	directory := global.Config.System.Directory
	err = c.SaveUploadedFile(file, directory+filename)
	if err != nil {
		return image, errors.New("图片保存失败")
	}
	image.Author = userClaims.Id
	image.Filename = filename
	image.Create = time.Now()
	return image, global.DB.Create(&image).Error
}

func (ImageService) GetAllImage(c *gin.Context) ([]model.Image, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power <= 0 {
		return nil, errors.New("权限不足")
	}

	var images []model.Image
	return images, global.DB.Order("id DESC").Find(&images).Error
}

func (ImageService) GetImageByAuthor(c *gin.Context) ([]model.Image, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return nil, errors.New("权限不足")
	}

	var images []model.Image
	return images, global.DB.Order("id DESC").Where("author = ?", userClaims.Id).Find(&images).Error
}

func (ImageService) DeleteImage(c *gin.Context) error {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return errors.New("权限不足")
	}

	var image model.Image
	err = global.DB.Where("id = ?", c.Query("id")).First(&image).Error
	if err != nil {
		return errors.New("未查询到该图片")
	}
	if userClaims.Id != image.Author && userClaims.Power <= 0 {
		return errors.New("没有权限删除该图片")
	}

	err = os.Remove(global.Config.System.Directory + image.Filename)
	if err != nil {
		global.Log.Warnln("删除旧图片失败", image.Filename)
	}
	return global.DB.Where("id = ?", image.Id).Delete(&image).Error
}

func (ImageService) ImageCount(c *gin.Context) (int64, error) {
	tokenString, _ := c.Cookie("token")
	userClaims, err := ParseToken(tokenString)
	if err != nil || userClaims.Power < 0 {
		return 0, errors.New("权限不足")
	}
	var count int64
	err = global.DB.Model(&model.Image{}).Count(&count).Error
	if err != nil {
		return 0, errors.New("查询用户数失败")
	}
	return count, nil
}
