FROM node:16-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

FROM base AS dev
ENV NODE_ENV development
RUN yarn install --frozen-lockfile --production=false
EXPOSE 3000
CMD yarn dev

FROM base AS prod
ENV NODE_ENV production
RUN yarn install --frozen-lockfile --production=true
EXPOSE 3000
RUN yarn build
CMD yarn start
