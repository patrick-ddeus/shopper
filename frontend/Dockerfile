FROM node:18-alpine

WORKDIR /usr/src/frontend

COPY . .

RUN npm install

EXPOSE 3030

CMD ["npm", "run", "dev"]