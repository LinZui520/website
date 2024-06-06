#!/bin/bash

cd /root/website

SMTP_PASS=$(grep -oP '^SMTP_PASS="\K[^"]+' /root/website/nextjs/.env)

sed -i "s/SMTP_PASS=${SMTP_PASS}/SMTP_PASS=\[FILTERED\]/g" /root/website/nextjs/.env

git pull origin main

if [ ! $? -eq 0 ]; then
	sed -i "s/SMTP_PASS=\[FILTERED\]/SMTP_PASS=${SMTP_PASS}/g" /root/website/nextjs/.env

	exit 1
fi

sed -i "s/SMTP_PASS=\[FILTERED\]/SMTP_PASS=${SMTP_PASS}/g" /root/website/nextjs/.env


docker restart $(docker ps -a --format '{{.Names}}' | grep -E "^website[-_]nextjs[-_]1$")
