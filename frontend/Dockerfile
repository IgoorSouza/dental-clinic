FROM node:20.18.0

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]