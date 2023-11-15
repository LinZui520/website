FROM ubuntu:latest

WORKDIR /opt/frontend

COPY . .


RUN apt-get update
RUN apt-get install -y nodejs npm curl wget && \
    npm install -g n && n stable
RUN apt-get install -y nginx && \
    npm install && \
    npm run build && \
    cp -r dist/* /usr/share/nginx/html && \
    cp nginx.conf /etc/nginx/nginx.conf 

EXPOSE 80

CMD ["nginx","-g","daemon off;"]