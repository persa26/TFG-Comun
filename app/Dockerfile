FROM node:15-alpine
WORKDIR /usr/src/redsocial/app
COPY package*.json ./ 
RUN npm install
RUN npm i -g nodemon
# ##############################
# # Set timezone to Madrid
RUN apk update && apk add --no-cache tzdata
ENV TZ=Europe/Madrid
################################
COPY . . 
EXPOSE 3080
CMD ["nodemon", "index.js"]