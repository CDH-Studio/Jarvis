FROM node:12.14.1

# set docker proxy settings
ENV http_proxy http://cdhwg01.prod.prv:80
ENV https_proxy http://cdhwg01.prod.prv:80

ENV TZ=America/Toronto

# install adonis cli
RUN npm i -g @adonisjs/cli

# change workign directory
WORKDIR /jarvis-core

# copy and run npm package list
COPY package*.json ./
RUN npm install

# copy the en
COPY . .

EXPOSE 3333

#CMD ["adonis", "serve", "--dev"]
CMD [ "npm", "run", "docker-start" ]