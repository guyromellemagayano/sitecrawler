FROM golang:1 AS dev
WORKDIR /app
RUN go get github.com/codegangsta/gin

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

CMD gin -i run *.go
EXPOSE 3000


FROM dev AS build

RUN mkdir /deps

RUN go build

# auto figure out cgo dependencies
RUN ldd /app/crawler | tr -s '[:blank:]' '\n' | grep '^/' | xargs -L 1 -I % cp --parents % /deps


FROM scratch AS prod

WORKDIR /

COPY --from=build /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=build /etc/ssl/certs /etc/ssl/certs
COPY --from=build /app/crawler /
COPY --from=build /deps /

EXPOSE 8000

CMD ["/crawler"]
