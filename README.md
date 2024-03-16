### 搭建属于自己的网站😎

边学习边搭建自己的个人网站

#### 依赖

```docker``` 和 ```docker-compose```

Debian系

```sh
$ apt install docker docker-compose
$ systemctl enable docker
```

RedHat系🤔

```sh
$ 
$
```

Arch系

```sh
$ pacman -S docker docker-compose
$ systemctl enable docker
```

#### 部署 

```sh
$ git clone git@github.com:LinZui520/website.git
```

阅读```./nginx```文件夹下的```README.md```文件 

阅读```./server```文件夹下的```README.md```文件 

然后```website```启动🫡

```sh
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
