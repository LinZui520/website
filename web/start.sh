#!/bin/bash

npm config set registry https://registry.npmmirror.com

npm install

npx prisma generate

npm run build

npm start
