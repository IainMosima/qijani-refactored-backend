FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY dist ./dist

COPY .env ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
