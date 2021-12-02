FROM node:16-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock /
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 3000

FROM base AS dev
ENV NODE_ENV development

FROM base AS prod
ENV NODE_ENV production
RUN yarn build
CMD yarn start
