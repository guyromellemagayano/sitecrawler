FROM golang:1 AS dev
WORKDIR /app
RUN go install github.com/codegangsta/gin@latest

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

ARG SERVICE=
WORKDIR /app/$SERVICE

CMD gin -i run *.go
EXPOSE 3000

FROM dev AS test

WORKDIR /app/
CMD go test ./...

FROM dev AS build

RUN mkdir /deps

RUN go build -o /service

# auto figure out cgo dependencies
RUN ldd /service | tr -s '[:blank:]' '\n' | grep '^/' | xargs -L 1 -I % cp --parents % /deps


FROM scratch AS prod

WORKDIR /

COPY --from=build /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=build /etc/ssl/certs /etc/ssl/certs
COPY --from=build /service /
COPY --from=build /deps /

EXPOSE 8000

CMD ["/service"]
