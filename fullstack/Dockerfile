FROM node

WORKDIR /root/website/fullstack

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]
