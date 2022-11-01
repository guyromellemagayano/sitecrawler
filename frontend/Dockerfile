FROM node:19-alpine3.15 AS dev

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add yarn --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ && \
	yarn install --pure-lockfile && \
	apk del yarn

COPY . ./

EXPOSE 3000

FROM dev AS prod

RUN yarn build

CMD yarn start
