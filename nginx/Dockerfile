# Bun image
FROM oven/bun:1 as base
# Set the working directory in the container
WORKDIR /usr/src/app
# install dependencies into temp directory
FROM base AS install
# -p create project structure even if it does not exist
# RUN mkdir -p /temp/dev
COPY package.json bun.lockb ./
# RUN cd /temp/dev && bun install --frozen-lockfile
# Install the application dependencies
RUN bun install --frozen-lockfile
# Copy the application code to the working directory
COPY . .
# Expose the port on which your application will run
USER backend
EXPOSE 8090
CMD [ "bun", "run", "index.ts" ]
