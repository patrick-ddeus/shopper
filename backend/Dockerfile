FROM node:latest

WORKDIR /usr/src/backend

COPY . .

RUN npm install
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]