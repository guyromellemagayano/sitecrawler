FROM node:17-alpine AS dev

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

EXPOSE 3000

FROM dev AS prod

RUN yarn build

CMD yarn start
