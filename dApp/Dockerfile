FROM node:10.7-stretch as builder
COPY ./ /build/
WORKDIR /build
RUN npm install
RUN npm run-script postinstall

EXPOSE 3001
CMD [ "npm", "start" ]