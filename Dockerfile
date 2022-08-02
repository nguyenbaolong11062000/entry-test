# syntax=docker/dockerfile:1
#Docker images can be inherited from other images
FROM node:16.16.0
WORKDIR /app
#Copy all
COPY . .
#Run command in the image
RUN npm install
#run inside a container
RUN npm install --global nodemon
RUN npm i --global @babel/node
RUN npm i --global @babel/cli
RUN ls node_modules/@babel
EXPOSE 3000
CMD ["npm", "start"]
