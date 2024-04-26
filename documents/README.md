### 项目技术栈

该网站前端技术栈 `TypeScript` + `React`

后端技术栈 `Golang` + `Gin` + `MySQL` + `Redis`

部署项目 `Docker` + `Docker Compose`



### 项目文件夹

- `database`：该文件夹下有 `logs` + `mysql` + `redis` 三个文件夹

  `logs` 下面存放网站运行时产生的日志文件

  `mysql` 下面存放了网站的全部数据 `data` 以及容器配置文件 `Dockerfile`

  `redis` 下面只存放了一个容器配置文件 `Dockerfile`

- `nginx`：该文件夹下有 `ssl` 文件夹以及若干文件

  `ssl` 下面存放**SSL证书**

  `Dockerfile` 容器配置文件

  `nginx.conf` 网站 `nginx` 服务的配置文件

- `server`：该文件夹存放的是后端文件，详细内容请阅读 `server.md`

- `web`：该文件夹存放的是前端文件，详细内容请阅读 `web.md`

- `docker-compose.yml`：该项目的核心文件，管理若干个容器