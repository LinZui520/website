FROM golang:latest

WORKDIR /root/website/service

COPY . .

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    GOPROXY="https://goproxy.cn,direct"

RUN go mod download
RUN go build main.go

CMD ["sh", "-c", "./main >> /root/website/database/logs/server.log"]
