## 开始部署
### 依赖

安装 `musl` 工具库

根据发行版不同命令不同

```shell
$ sudo pacman -S musl
```

安装cargo需要的包

```shell
$ rustup target add x86_64-unknown-linux-musl
```

### 环境变量

将 `.env.example` 重命名为 `.env`

``` shell
$ mv .env.example .env
```
并补充缺失字段

### 开始构建

```shell
$ cargo build --release --target x86_64-unknown-linux-musl
```









