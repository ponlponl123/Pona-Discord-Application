FROM node:22.4.1

WORKDIR /pona

COPY . .

RUN npm install

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]