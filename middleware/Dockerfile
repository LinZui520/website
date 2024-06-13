FROM nginx

WORKDIR /root/website/middleware
COPY . .
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx","-g","daemon off;"]
