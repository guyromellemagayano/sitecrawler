FROM node:14-alpine AS dev
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV development

COPY package.json /app
COPY yarn.lock /app

RUN yarn install --frozen-lockfile

COPY . /app

EXPOSE 3000

FROM dev AS prod

ENV NODE_ENV production

RUN yarn build

CMD yarn start
