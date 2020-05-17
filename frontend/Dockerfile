FROM node

RUN mkdir /install
WORKDIR /install

COPY package*.json ./
RUN npm install

ENV NODE_PATH=/install/node_modules

WORKDIR /app

COPY . .

EXPOSE 3000
