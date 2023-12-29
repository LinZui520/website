package service

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"math"
	"strconv"
)

func VerifySliderCaptcha(c *gin.Context) error {
	x, _ := strconv.ParseFloat(c.PostForm("x"), 64)
	y, _ := strconv.ParseFloat(c.PostForm("y"), 64)
	duration, _ := strconv.ParseFloat(c.PostForm("duration"), 64)
	length, _ := strconv.Atoi(c.PostForm("length"))
	if x != 260 || y == 0 || duration < 100 || length < 10 {
		return errors.New("我一眼就看出你不是人")
	}
	trail := make([][2]float64, length)
	distance := make([]float64, length)
	exception := 0
	for i := 0; i < length; i++ {
		x, errX := strconv.ParseFloat(c.PostForm(fmt.Sprintf("trail[%d][0]", i)), 64)
		y, errY := strconv.ParseFloat(c.PostForm(fmt.Sprintf("trail[%d][1]", i)), 64)
		if errX != nil || errY != nil {
			return errors.New("我一眼就看出你不是人")
		}
		trail[i] = [2]float64{x, y}

		if i > 0 {
			distance[i] = calculateDistance(trail[i-1], trail[i])
			if distance[i] > 60 {
				exception++
			}
		}

		if i > 1 {
			accelerations := (distance[i] - distance[i-1]) / 1
			if accelerations < -30 || accelerations > 30 {
				exception++
			}
		}
	}
	if exception > 3 || trail[length-1][0]-trail[0][0] < 260 {
		return errors.New("我一眼就看出你不是人")
	}
	return nil
}

func calculateDistance(point1, point2 [2]float64) float64 {
	x1, y1 := point1[0], point1[1]
	x2, y2 := point2[0], point2[1]
	return math.Sqrt(math.Pow(x2-x1, 2) + math.Pow(y2-y1, 2))
}
