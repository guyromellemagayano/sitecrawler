FROM node AS dev

RUN mkdir /install
WORKDIR /install

COPY package*.json ./
RUN npm install

ENV NODE_PATH=/install/node_modules

WORKDIR /app

COPY . .

RUN ln -s /install/node_modules node_modules

EXPOSE 3000


# build prod assets
FROM dev AS prod

RUN npm run build

CMD npm start
