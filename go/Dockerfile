FROM golang:1 AS dev
WORKDIR /app
RUN go get github.com/codegangsta/gin

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

ARG SERVICE=
WORKDIR /app/$SERVICE

CMD gin -i run *.go
EXPOSE 3000


FROM dev AS build
ARG SERVICE=

RUN mkdir /deps

RUN go build

# auto figure out cgo dependencies
RUN ldd /app/$SERVICE/$SERVICE | tr -s '[:blank:]' '\n' | grep '^/' | xargs -L 1 -I % cp --parents % /deps


FROM scratch AS prod
ARG SERVICE=

WORKDIR /

COPY --from=build /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=build /etc/ssl/certs /etc/ssl/certs
COPY --from=build /app/$SERVICE /
COPY --from=build /deps /

EXPOSE 8000

CMD ["/$SERVICE"]
