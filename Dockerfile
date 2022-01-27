FROM node:17
ENV DISABLE_ESLINT_PLUGIN=true
WORKDIR /usr/src/app
COPY . .

RUN npm i -g esm
RUN npm i -g concurrently
RUN npm i -g nodemon
RUN yarn install --production=true


WORKDIR /usr/src/app/client
RUN yarn
RUN yarn run build

WORKDIR /usr/src/app/server
RUN yarn install --production=true

WORKDIR /usr/src/app
EXPOSE 12400

CMD [ "yarn", "run", "server" ]