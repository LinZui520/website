## 这里主要放一些辅助工具



### 自动同步 `GitHub` 代码部署

#### 原理

当仓库`main`分支`merge`代码时，`Github`通过`Webhooks`向指定服务器路由发送一个`Post`请求。

这个时候在服务器开启一个服务，这边是通过`Rust`的`actix-web`框架在`8080`端口开启一个服务。

该服务监听`/api/github/webhook`路由的`Post`请求并通过`Nginx`代理到`80`端口。

当服务器接受到一个发送到`/api/github/webhook`的`Post`请求且验证是`Github`发送的的时候，该程序执行`/bin/sh scripts/restart.sh` 通过该脚本重新部署。

### 启动自动部署

依赖：

```sh
$ apt install cargo
```

在`Github`设置`Webhooks`并将密钥写进`website/web/.env`文件

启动：

```sh
$ cd /root/website/tools/webhook
$ cargo build --release
$ setsid ./target/release/webhook
```

