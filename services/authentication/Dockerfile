# image
FROM oven/bun
# create and set directory
WORKDIR /tmp
COPY package*.json bun.lockb ./
# install dependencies
RUN bun install --frozen-lockfile
# copy
COPY . .
# setup port
USER backend
EXPOSE 8091
CMD [ "bun", "run", "index.ts" ]