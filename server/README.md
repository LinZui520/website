### 获取SMTP服务

> 自行搜索如何获取

### 修改配置文件

修改```settings.yaml```文件**system**下的四个```smtp_*```选项

email为发送邮件的邮箱地址

password为获取SMTP服务得到的密钥

host为获取SMTP服务的主机，如```smtp.gmail.com```

port为获取SMTP服务的主机端口，如```google```的端口为**587**

### 修改源代码

修改```./router/index.go```文件

根据文件里面的注释，注释掉```router.StaticFS*```这一行

> 理由在注释里面

### 修改用户默认头像

修改`website/database/mysql/data/image/default.png`

图片必须取这个名字



### Server所依赖的第三方包

> 不用理会


```shell
$ go get github.com/spf13/viper
$ go get gorm.io/gorm
$ go get gorm.io/driver/mysql
$ go get github.com/sirupsen/logrus
$ go get github.com/go-redis/redis
$ go get github.com/gin-gonic/gin
$ go get -u gopkg.in/gomail.v2
$ go get -u github.com/golang-jwt/jwt/v5
$ go get -u github.com/gorilla/websocket
```