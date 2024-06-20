FROM node:18

WORKDIR /elnour

COPY . .

EXPOSE 2502

CMD [ "node" , "index.js"]