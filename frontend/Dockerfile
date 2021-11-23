# Development
FROM node:14-alpine AS dev
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

EXPOSE 3000

# Production
FROM dev AS prod

ENV NODE_ENV production

RUN yarn build

CMD yarn start

