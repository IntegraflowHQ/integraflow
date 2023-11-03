FROM node:iron-buster-slim

WORKDIR /frontend

COPY . .

EXPOSE 3000
