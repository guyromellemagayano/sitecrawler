# Development
FROM node:14-alpine AS dev
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --install-lockfile
COPY . .

EXPOSE 3000

# Production
FROM node:14-alpine AS prod
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=dev /app/public ./public
COPY --from=dev --chown=nextjs:nodejs /app/.next ./.next
COPY --from=dev /app/node_modules ./node_modules
COPY --from=dev /app/package.json ./package.json

USER nextjs

RUN yarn build

CMD yarn start

