FROM node:14.11

WORKDIR /usr/src/app
COPY . .

RUN npm i -g esm
RUN npm i -g concurrently
RUN npm i -g nodemon
RUN yarn install --production=true


WORKDIR /usr/src/app/client
RUN yarn
RUN rm -R build
RUN yarn run build

WORKDIR /usr/src/app/server
RUN yarn install --production=true

WORKDIR /usr/src/app
EXPOSE 12399
EXPOSE 3000

CMD [ "yarn", "run", "server" ]