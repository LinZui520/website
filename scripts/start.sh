#!/bin/bash

cd /root/website

docker-compose build

docker-compose up -d
