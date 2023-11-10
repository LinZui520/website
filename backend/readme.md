## backend

### 安装go包
```sh
$ go get github.com/spf13/viper
$ go get gorm.io/gorm
$ go get gorm.io/driver/mysql
$ go get github.com/sirupsen/logrus
$ go get github.com/gin-gonic/gin
$ go get -u github.com/golang-jwt/jwt/v5
```
### 打包
```sh
$ set GOARCH=amd64
$ set GOOS=linux
$ go build main.go
```
