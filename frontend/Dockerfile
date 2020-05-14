FROM node
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY yarn.lock .
RUN yarn install

COPY . .

EXPOSE 3000
