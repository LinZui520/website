drop database website;
create database if not exists website;
use website;

drop table if exists images;
create table if not exists images (
    id int auto_increment comment '图片编号',
    filename  varchar(64) not null comment '图片文件名',
    primary key (id),
    unique key (filename)
) AUTO_INCREMENT=100000;

insert into images (filename) values ('17000000000000000.jpg');
drop table if exists users;
create table users (
    id int auto_increment comment '用户编号',
    avatar int null comment '头像编号',
    username varchar(32) not null comment '用户名',
    email varchar(32) not null comment '邮箱',
    password varchar(64) not null comment '密码',
    power int default 0 comment '用户权限',
    register datetime comment '创建时间',
    login datetime comment '最近登陆时间',
    primary key (id),
    unique key (username),
    unique key (email),
    foreign key (avatar) references images (id)
) AUTO_INCREMENT=100000;
