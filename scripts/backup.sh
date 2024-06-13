#!/bin/bash

rm -rf /root/data/*
mkdir -p /root/data

cp -r /root/website/database/image /root/data/

/usr/bin/docker exec $(docker ps -a --format '{{.Names}}' | grep -E "^website[-_]database[-_]1$") bash -c "mysqldump -uroot -p123456 website > /tmp/backup.sql"
/usr/bin/docker cp $(docker ps -a --format '{{.Names}}' | grep -E "^website[-_]database[-_]1$"):/tmp/backup.sql /root/data/backup.sql
