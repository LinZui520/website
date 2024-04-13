package service

import (
	"errors"
	"github.com/gin-gonic/gin"
	"math"
	"strconv"
)

func VerifySliderCaptcha(c *gin.Context) error {
	x, _ := strconv.ParseFloat(c.PostForm("x"), 64)
	y, _ := strconv.ParseFloat(c.PostForm("y"), 64)
	duration, _ := strconv.ParseFloat(c.PostForm("duration"), 64)
	length, _ := strconv.Atoi(c.PostForm("length"))
	if x != 260 || y == 0 || duration < 128 || length < 10 {
		return errors.New("我一眼就看出你不是人")
	}
	//trail := make([][2]float64, length)
	//for i := 0; i < length; i++ {
	//	x, errX := strconv.ParseFloat(c.PostForm(fmt.Sprintf("trail[%d][0]", i)), 64)
	//	y, errY := strconv.ParseFloat(c.PostForm(fmt.Sprintf("trail[%d][1]", i)), 64)
	//	if errX != nil || errY != nil {
	//		return errors.New("我一眼就看出你不是人")
	//	}
	//	trail[i] = [2]float64{x, y}
	//}
	//if verifyTrajectoryLength(trail, length) != true || verifyTrajectorySmooth(trail, length) != true {
	//	return errors.New("我一眼就看出你不是人")
	//}
	return nil
}

func calculateDistance(point1, point2 [2]float64) float64 {
	x1, y1 := point1[0], point1[1]
	x2, y2 := point2[0], point2[1]
	return math.Sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
}

func verifyTrajectoryLength(trail [][2]float64, length int) bool {
	distance := make([]float64, length)
	exception := 0
	for i := 1; i < length; i++ {
		distance[i] = calculateDistance(trail[i-1], trail[i])
		if distance[i] > 64 {
			exception++
		}
		accelerations := (distance[i] - distance[i-1]) / 1
		if accelerations < -32 || accelerations > 32 {
			exception++
		}
	}
	if exception > 4 || trail[length-1][0]-trail[0][0] < 256 || trail[length-1][0]-trail[0][0] > 512 {
		return false
	}
	return true
}

func verifyTrajectorySmooth(trail [][2]float64, length int) bool {
	for i := 3; i < length-3; i++ {
		a := calculateDistance(trail[i-1], trail[i])
		b := calculateDistance(trail[i], trail[i+1])
		c := calculateDistance(trail[i-1], trail[i+1])
		if a == 0 || b == 0 || c == 0 {
			continue
		}
		//angle为弧度值
		angle := math.Acos((a*a + b*b - c*c) / (2 * a * b))
		//128°
		if angle < 2.234 {
			return false
		}
	}
	return true
}
