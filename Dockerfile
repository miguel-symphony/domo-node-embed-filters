FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

ENTRYPOINT npm start -- -p 8080
