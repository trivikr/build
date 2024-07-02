FROM node:20-slim

WORKDIR /usr/src/app

COPY package.json ./
COPY src ./src

RUN npm install --omit=dev

CMD ["npm", "run", "index-generator"]
