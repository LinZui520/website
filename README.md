## 第一次从零搭建自己的博客😎

### 前端部署

项目目录：**前端**``/root/blog/frontend`` **后端**``/root/blog/backend``

安装``nginx``

```sh
$ apt install nginx
```

配置

```sh
$ vim /etc/nginx/nginx.conf
```

```sh
use root;
		
http {
	server {
		location / {
            root   /root/blog/frontend;
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
	
	
	# include /etc/nginx/conf.d/*.conf;
	# include /etc/nginx/sites-enabled/*;

}		
```

将打包生成的dist文件夹下的所有文件复制到``/root/blog/frontend`` 目录下

运行

```sh
nginx
```

### 后端打包

将打包生成的``main``  ``settings.yaml``复制到``/root/blog/backend``目录下

新建``image``目录

```sh
$ mkdir /root/blog/backend/image
$ chmod 777 -R /root/blog/backend/image
```

修改``settings.yaml``配置文件和``install.sql``脚本

后台运行

```sh
$ chmod 777 main
$ setsid ./main
```

### 配置数据库

安装``mysql``并运行

```sh
$ apt install mysql-server
$ /etc/init.d/mysql start
$ systemctl mysql-server
$ mysql_secure_installation
```

修改``mysql``密码

```sh
$ mysql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '密码';
```

在``/root/blog/backend``目录下登陆

```sh
$ mysql -u root -p
$ source install.sql
```

开启80端口访问

```sh
$ apt install firewall
$ firewall-cmd --permanent --add-port=80/tcp
$ firewall-cmd --reload
$ systemctl stop firewalld
```

