FROM node:20-alpine
LABEL author="Moises Santos"
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000:3000

CMD ["npm", "run", "start:prod"]