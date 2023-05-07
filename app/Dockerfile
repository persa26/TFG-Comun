FROM node:15-alpine
WORKDIR /usr/src/redsocial/app
COPY package*.json ./ 
RUN npm install
RUN npm i -g nodemon
COPY . . 
EXPOSE 3080
CMD ["nodemon", "index.js"]