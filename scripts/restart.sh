#!/bin/bash

cd /root/website

SMTP_PASS=$(grep -oP '^SMTP_PASS="\K[^"]+' /root/website/nextjs/.env)
AUTH_SECRET=$(grep -oP '^AUTH_SECRET="\K[^"]+' /root/website/nextjs/.env)
GITHUB_WEBHOOK_SECRET=$(grep -oP '^GITHUB_WEBHOOK_SECRET="\K[^"]+' /root/website/nextjs/.env)

sed -i "s/SMTP_PASS=${SMTP_PASS}/SMTP_PASS=\[FILTERED\]/g" /root/website/nextjs/.env
sed -i "s/AUTH_SECRET=${AUTH_SECRET}/AUTH_SECRET=\[FILTERED\]/g" /root/website/nextjs/.env
sed -i "s/GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}/GITHUB_WEBHOOK_SECRET=\[FILTERED\]/g" /root/website/nextjs/.env

git pull origin main
GIT_PULL_RESULT=$?

sed -i "s/SMTP_PASS=\[FILTERED\]/SMTP_PASS=${SMTP_PASS}/g" /root/website/nextjs/.env
sed -i "s/AUTH_SECRET=\[FILTERED\]/AUTH_SECRET=${AUTH_SECRET}/g" /root/website/nextjs/.env
sed -i "s/GITHUB_WEBHOOK_SECRET=\[FILTERED\]/GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}/g" /root/website/nextjs/.env


if [ ! $GIT_PULL_RESULT -eq 0 ]; then
	exit 1
fi


docker restart $(docker ps -a --format '{{.Names}}' | grep -E "^website[-_]nextjs[-_]1$")
