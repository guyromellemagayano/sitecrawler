FROM node:16-alpine AS dev

RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV development

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

EXPOSE 3000

FROM dev AS prod

ENV NODE_ENV production

RUN yarn build

CMD yarn start
