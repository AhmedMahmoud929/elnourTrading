FROM node:18

WORKDIR /usr/www/elnour

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 2502

CMD [ "node" , "index.js"]