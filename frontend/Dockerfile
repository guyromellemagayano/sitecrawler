FROM node:14 AS dev

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --install-lockfile

COPY . .

FROM dev AS prod

RUN yarn build

CMD yarn start
