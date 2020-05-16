FROM node

RUN mkdir /install
WORKDIR /install

COPY package*.json ./
RUN npm install

COPY yarn.lock .
RUN yarn install

ENV NODE_PATH=/install/node_modules

WORKDIR /app

COPY . .

EXPOSE 3000
