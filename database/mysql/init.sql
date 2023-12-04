create database if not exists website;
use website;
create table if not exists users (
    id int unsigned auto_increment comment '用户编号',
    nickname varchar(32) not null comment '昵称',
    username varchar(32) not null comment '用户名',
    password varchar(64) not null comment '密码',
    power int default 0 not null comment '用户权限',
    creation datetime not null comment '创建时间',
    latest datetime null comment '最近登陆时间',
    primary key (id),
    unique key (username)
) AUTO_INCREMENT=100000;

create table if not exists images (
    id int unsigned auto_increment comment '图片编号',
    url  varchar(64) not null comment '图片url',
    creation datetime not null comment '创建时间',
    primary key (id),
    unique key (url)
) AUTO_INCREMENT=100000;

create table if not exists articles (
    id int unsigned auto_increment comment '文章编号',
    author int unsigned not null comment '作者编号',
    image int unsigned not null comment '标题图片编号',
    title varchar(256) not null comment '标题',
    content longtext null comment '内容',
    creation datetime not null comment '创建时间',
    latest datetime not null comment '最近更新时间',
    primary key (id),
    foreign key (image) references images (id)
) AUTO_INCREMENT=100000;
