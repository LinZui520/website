### 搭建属于自己的网站😎

边学习边搭建自己的个人网站

想了解代码细节请阅读`documents/README.md`

#### 依赖

`docker` 和 `docker-compose`

`Debian`系

```sh
$ apt install docker docker-compose
$ systemctl enable docker
$ systemctl start docker 
```

`RedHat`系🤔

```sh
$ yum install docker docker-compose
$ systemctl enable docker 
$ systemctl start docker 
```

`Arch`系

```sh
$ pacman -S docker docker-compose
$ systemctl enable docker
$ systemctl start docker 
```

#### 部署 

```sh
$ git clone git@github.com:LinZui520/website.git
```

阅读`nginx/README.md`

阅读`web/README.md`

阅读`server/README.md`

然后`website`启动🫡

```sh
$ docker-compose build
$ docker-compose up -d
```



### 代码提交规范

feat: 新增功能

fix: 修复功能

docs: 更新文档

style: 代码格式变更

refactor: 代码重构，非新增功能，非修改功能

perf: 性能优化

test: 增加测试用例

chore: 构建过程或辅助工具的变动

revert: 代码回退
