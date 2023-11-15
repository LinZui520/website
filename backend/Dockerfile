FROM golang:latest

WORKDIR /root/blog/backend

COPY . .

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
	GOPROXY="https://goproxy.cn,direct"

RUN go mod download
RUN go build main.go

EXPOSE 8080

CMD ["./main"]
