# image
FROM oven/bun
# create and set directory
WORKDIR /tmp
COPY package*.json bun.lockb ./
# install dependencies
RUN bun install --frozen-lockfile
# copy
COPY . .
# Setup port
USER label
EXPOSE 8092
CMD [ "bun", "run", "index.ts" ]