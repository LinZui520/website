package config

import "fmt"

type System struct {
	Host         string `yaml:"host"`
	Port         int    `yaml:"port"`
	Env          string `yaml:"env"`
	Directory    string `yaml:"directory"`
	SMTPEmail    string `yaml:"smtp_email" mapstructure:"smtp_email"`
	SMTPPassword string `yaml:"smtp_password" mapstructure:"smtp_password"`
	SMTPHost     string `yaml:"smtp_host" mapstructure:"smtp_host"`
	SMTPPort     int    `yaml:"smtp_port" mapstructure:"smtp_port"`
}

func (s System) Address() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}
