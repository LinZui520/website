drop database blog;
create database blog;
use blog;
create table if not exists users (
    id int unsigned auto_increment comment '用户编号',
    username varchar(32) not null comment '用户名',
    password varchar(64) not null comment '密码',
    primary key (id)
) AUTO_INCREMENT=100000;

create table if not exists images (
    id int unsigned auto_increment comment '图片编号',
    url varchar(64) not null comment '图片url',
    primary key (id)
) AUTO_INCREMENT=100000;

create table if not exists articles (
    id int unsigned auto_increment comment '文章编号',
    image int unsigned not null comment '标题图片编号',
    title varchar(200) not null comment '标题',
    content longtext null comment '内容',
    primary key (id),foreign key (image) references images (id)
) AUTO_INCREMENT=100000;

