drop database website;
create database if not exists website;
use website;

drop table if exists users;
create table users (
    id int auto_increment comment '用户编号',
    avatar varchar(32) comment '头像编号',
    username varchar(32) not null comment '用户名',
    email varchar(32) not null comment '邮箱',
    password varchar(64) not null comment '密码',
    power int default 0 comment '用户权限',
    register datetime comment '创建时间',
    login datetime comment '最近登陆时间',
    primary key (id),
    unique key (username),
    unique key (email)
) AUTO_INCREMENT=100000;


create table if not exists articles (
    id int auto_increment comment '文章编号',
    author int not null comment '作者编号',
    title varchar(256) not null comment '标题',
    content longtext null comment '内容',
    `create` datetime not null comment '创建时间',
    `update` datetime not null comment '最近更新时间',
    primary key (id),
    foreign key (author) references users(id)
) AUTO_INCREMENT=100000;