FROM node:20-alpine
LABEL author="Moises Santos"
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["npm", "run", "start:prod"]