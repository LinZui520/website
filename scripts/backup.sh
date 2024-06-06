#!/bin/bash

rm -rf /root/data/*
mkdir -p /root/data

cp -r /root/website/mysql/data/image /root/data/

/usr/bin/docker exec $(docker ps -a --format '{{.Names}}' | grep -E "^website[-_]mysql[-_]1$") bash -c "mysqldump -uroot -p123456 website > /tmp/backup.sql"
/usr/bin/docker cp $(docker ps -a --format '{{.Names}}' | grep -E "^website[-_]mysql[-_]1$"):/tmp/backup.sql /root/data/backup.sql
