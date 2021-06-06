FROM node:14 AS dev

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install --install-lockfile

COPY . /app

EXPOSE 3000

FROM dev AS prod

RUN yarn build

CMD yarn start
