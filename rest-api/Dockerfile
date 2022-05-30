FROM node:18-alpine@sha256:8a7f5435fd83f6d1dbdeff2decad2275b2550d28cacf7acd653d2cbaee957965

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
