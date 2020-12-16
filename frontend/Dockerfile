FROM node:14 AS dev

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3000 3030


# build prod assets
FROM dev AS prod

RUN yarn run build

CMD yarn start
