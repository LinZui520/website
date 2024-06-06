## 这里主要放一些辅助工具



### 自动同步 `GitHub` 代码部署

#### 原理

当仓库main分支merge代码时，Github通过Webhook向指定服务器路由发送一个Post请求这个时候在服务器开启一个服务，这边是通过Python的Flask框架在8080端口开启一个服务监听/api/github/webhook路由的Post请求并通过Nginx代理到80端口，当接受到一个Post请求且验证是Github发送的的时候，该Python程序执行`/bin/sh scripts/restart.sh` 通过该脚本重新部署。

### 启动自动部署

依赖：

```sh
$ apt install python3
$ apt install python-flask gunicorn
```

在Github设置Webhook并将密钥写进website/nextjs/.env

启动：

```sh
$ cd /root/website/tools
$ setsid gunicorn -w 1 webhook:app -b 127.0.0.1:8080
```

