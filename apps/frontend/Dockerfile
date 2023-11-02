FROM node:iron-buster-slim

WORKDIR /frontend

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .


EXPOSE 3000

CMD ["yarn", "dev"]