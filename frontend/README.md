# frontend

## 项目设置

```sh
npm install
```

### 编译和热重载以进行开发

```sh
npm run dev
```

### 打包

```sh
$ npm run build
```

### 安装nginx

```sh
$ sudo pacman -S nginx
```

### 配置

```sh
$ sudo vim /etc/nginx/nginx.conf

use root;
		
http {
	server {
		location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:8080/api;
        }

        location /image {
            root /home/linzui/Code/blog/backend;
            allow all;
            autoindex on;
        }
	}

}		
$ sudo chmod 777 -R /home/linzui/Code/blog/backend/image
$ sudo cp -r dist/* /usr/share/nginx/html/
```

### 运行

```sh
nginx
```



