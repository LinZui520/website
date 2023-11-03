package config

type Logger struct {
	Level        string `yaml:"level"`
	Prefix       string `yaml:"prefix"`
	Director     string `yaml:"director"`
	ShowLine     int    `yaml:"show_line"`
	LogInConsole int    `yaml:"log_in_console"`
}
