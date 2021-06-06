FROM node:14 AS dev

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

FROM dev AS prod

RUN yarn build

CMD yarn start
