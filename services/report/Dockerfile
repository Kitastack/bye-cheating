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
USER report
EXPOSE 8094
CMD [ "bun", "run", "index.ts" ]