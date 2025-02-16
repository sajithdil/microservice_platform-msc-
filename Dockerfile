FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN cd /usr/src/app && npm install --force

EXPOSE 3000
CMD [ "npm", "start" ]