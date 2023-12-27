package service

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"math"
	"strconv"
)

func VerifySliderCaptcha(c *gin.Context) error {
	x, _ := strconv.Atoi(c.PostForm("x"))
	y, _ := strconv.Atoi(c.PostForm("y"))
	duration, _ := strconv.Atoi(c.PostForm("duration"))
	length, _ := strconv.Atoi(c.PostForm("length"))
	if x != 260 || y == 0 || duration < 100 || length < 10 {
		return errors.New("我一眼就看出你不是人")
	}
	trail := make([][2]int, length)
	distance := make([]float64, length)
	exception := 0
	for i := 0; i < length; i++ {
		x, errX := strconv.Atoi(c.PostForm(fmt.Sprintf("trail[%d][0]", i)))
		y, errY := strconv.Atoi(c.PostForm(fmt.Sprintf("trail[%d][1]", i)))
		if errX != nil || errY != nil {
			return errors.New("我一眼就看出你不是人")
		}
		trail[i] = [2]int{x, y}

		if i > 0 {
			distance[i] = calculateDistance(trail[i-1], trail[i])
			if distance[i] > 50 {
				exception++
			}
		}

		if i > 1 {
			accelerations := (distance[i] - distance[i-1]) / 1
			if accelerations < -20 || accelerations > 20 {
				exception++
			}
		}
	}
	if exception > 3 || trail[length-1][0]-trail[0][0] < 260 {
		return errors.New("我一眼就看出你不是人")
	}
	return nil
}

func calculateDistance(point1, point2 [2]int) float64 {
	x1, y1 := point1[0], point1[1]
	x2, y2 := point2[0], point2[1]
	return math.Sqrt(math.Pow(float64(x2-x1), 2) + math.Pow(float64(y2-y1), 2))
}
