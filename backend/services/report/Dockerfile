# image
FROM nodered/node-red
# create and set directory
WORKDIR /app
USER root
RUN apk add --no-cache ffmpeg
COPY package.json ./
# install dependencies
RUN npm install typescript -g
RUN npm install
# Copy the rest of the application files to the container
COPY . .
# setup port
# EXPOSE 8091
ENTRYPOINT [ "npm", "run", "start" ]