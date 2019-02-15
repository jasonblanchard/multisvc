FROM node:10.4.1

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /home/app
RUN cp -a /tmp/node_modules /home/app

ADD . /home/app

WORKDIR /home/app

CMD npm run start