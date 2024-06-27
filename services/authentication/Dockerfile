# image
FROM oven/bun:latest
# create and set directory
WORKDIR /app
RUN apt-get update && apt-get clean
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