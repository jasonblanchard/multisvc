FROM node:10.4.1

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /home/app/webapp
RUN cp -a /tmp/node_modules /home/app/webapp

ADD . /home/app/webapp

WORKDIR /home/app/webapp

# TODO: Set NODE_ENV to production
CMD npm run start