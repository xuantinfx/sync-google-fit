FROM node:10-alpine

WORKDIR /opt/app

ENV NODE_ENV production

COPY package*.json ./

COPY . /opt/app

RUN npm install --dev

CMD [ "npm", "start" ]
