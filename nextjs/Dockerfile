FROM node

WORKDIR /root/website/nextjs

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]
