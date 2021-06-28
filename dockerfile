FROM node:alpine

WORKDIR /usr/bot

COPY . .

RUN npm i

CMD ["node", "."]