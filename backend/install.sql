create database if not exists blog;
use blog;

create table if not exists users (
    id int unsigned auto_increment comment '用户编号',
    username varchar(32) not null comment '用户名',
    password char(32) not null comment '密码',
    primary key (id)
);

insert into users(username, password) value ('账号', '密码');

create table if not exists articles (
    id int unsigned auto_increment comment '文章编号',
    title varchar(200) null comment '标题',
    image varchar(200) comment '标题图片url',
    content longtext null comment '内容',
    primary key (id)
);

create table if not exists comments (
    id int unsigned auto_increment comment '评论编号',
    commenter varchar(200) comment '留言者',
    content text comment '留言内容',
    primary key (id)
);