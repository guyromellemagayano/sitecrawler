FROM node AS dev

RUN mkdir /install
WORKDIR /install

COPY package*.json ./
RUN yarn

ENV NODE_PATH=/install/node_modules

WORKDIR /app

COPY . .

RUN ln -s /install/node_modules node_modules

EXPOSE 3000


# build prod assets
FROM dev AS prod

RUN yarn run build

CMD yarn start
