### 搭建属于自己的网站😎

边学习边搭建自己的个人网站

### 依赖

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

### 部署 

```sh
$ git clone git@github.com:LinZui520/website.git
```

阅读```./nginx```文件夹下的```README.md```文件 

阅读```./server```文件夹下的```README.md```文件 

然后```website```启动🫡

```sh
$ docker-compose build
$ docker-compose up -d
```
