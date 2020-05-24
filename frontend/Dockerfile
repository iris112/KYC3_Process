FROM node:10.7-stretch as builder
COPY ./ /build/
WORKDIR /build
RUN npm install
RUN node_modules/.bin/ng build --prod

FROM nginx

ENV NGINX_PORT 80

RUN apt-get update && apt-get install -y certbot
COPY docker/default.conf /etc/nginx/conf.d/default.conf.template
RUN mkdir -p /var/www/letsencrypt && chown www-data:www-data /var/www/letsencrypt
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html/
EXPOSE $NGINX_PORT
CMD /bin/bash -c 'envsubst \$NGINX_PORT < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"'
