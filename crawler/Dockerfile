FROM golang:1
WORKDIR /app
RUN go get github.com/codegangsta/gin

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

CMD gin run *.go
EXPOSE 3000
