package service

import (
	"crypto/rand"
	"fmt"
	"gopkg.in/gomail.v2"
	"math/big"
	"server/global"
)

func GenerateRandomCode(length int) (string, error) {
	const charset = "0123456789"
	code := make([]byte, length)

	for i := range code {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		code[i] = charset[n.Int64()]
	}

	return string(code), nil
}

func SendVerificationEmail(email, code string) error {
	message := gomail.NewMessage()
	message.SetHeader("From", global.Config.System.Email)
	message.SetHeader("To", email)
	message.SetHeader("Subject", "Email Verification Code")
	message.SetBody("text/plain", fmt.Sprintf("Your verification code is: %s", code))

	dialer := gomail.NewDialer("smtp.gmail.com", 587, global.Config.System.Email, global.Config.System.Password)

	return dialer.DialAndSend(message)
}
