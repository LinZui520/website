package config

import "fmt"

type System struct {
	Host      string `yaml:"host"`
	Port      int    `yaml:"port"`
	Env       string `yaml:"env"`
	Email     string `yaml:"email"`
	Password  string `yaml:"password"`
	Directory string `yaml:"directory"`
}

func (s System) Address() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}
