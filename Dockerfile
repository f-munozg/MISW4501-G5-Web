FROM node:24-alpine3.20

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install
RUN ng build
CMD ["ng", "serve", "--host", "0.0.0.0", "--no-hmr"]