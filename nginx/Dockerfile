FROM nginx

WORKDIR /root/website/nginx
COPY . .
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx","-g","daemon off;"]
