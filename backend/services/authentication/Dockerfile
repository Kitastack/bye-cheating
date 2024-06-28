# image
FROM ubuntu:latest
# create and set directory
WORKDIR /app

RUN apt-get update && apt-get install curl -y
RUN apt-get clean
RUN apt-get update && apt-get install unzip -y
RUN apt-get clean
RUN apt-get update && apt-get install ffmpeg -y
RUN curl -fsSL https://bun.sh/install | bash && \
ln -s $HOME/.bun/bin/bun /usr/local/bin/bun
RUN apt-get clean

# Copy the package.json and lock file to the container
COPY package.json ./
# install dependencies
RUN bun install typescript -g
RUN bun install
# Copy the rest of the application files to the container
COPY . .
# setup port
ENV PORT 8000
# EXPOSE 8091
CMD [ "ls" ]
CMD [ "bun", "run", "start" ]

# # image
# FROM oven/bun:latest
# # create and set directory
# WORKDIR /app
# # RUN apt-get update && apt-get install ffmpeg -y
# RUN apt-get update && apt-get clean 
# # Copy the package.json and lock file to the container
# COPY package.json ./
# # install dependencies
# RUN bun install typescript -g
# RUN bun install
# # Copy the rest of the application files to the container
# COPY . .
# # setup port
# ENV PORT 8000
# # EXPOSE 8091
# CMD [ "ls" ]
# CMD [ "bun", "run", "start" ]