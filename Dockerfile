
FROM nginx:alpine as nginxProxy

COPY nginx.conf /etc/nginx/nginx.conf

RUN apk update && apk add bash


FROM node:12.17.0-alpine as usersApp
WORKDIR /usr/src/app

COPY ./users/package*.json ./
RUN npm install

COPY ./users/ .

EXPOSE 5000

CMD [ "npm", "start" ]


FROM node:12.17.0-alpine as settingsApp
WORKDIR /usr/src/app

COPY ./settings/package*.json ./
RUN npm install

COPY ./settings/ .

EXPOSE 5001

CMD [ "npm", "start" ]


FROM node:12.17.0-alpine as tasksApp
WORKDIR /usr/src/app

COPY ./tasks/package*.json ./
RUN npm install

COPY ./tasks/ .

EXPOSE 5002

CMD [ "npm", "start" ]
