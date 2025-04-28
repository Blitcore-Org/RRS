FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY main.js .
COPY logger.js .
COPY sendLogs.js .
COPY models/ ./models

COPY .env.example .env

CMD ["node", "main.js"]