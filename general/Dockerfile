# multistage
FROM node:18 AS base

FROM base AS base-installer
RUN apt-get update

FROM base-installer AS ffmpeg-installer
RUN apt install --no-install-recommends -y ffmpeg

FROM base AS runtime
COPY --from=ffmpeg-installer /usr/bin/ffmpeg /usr/bin/ffmpeg
COPY --from=ffmpeg-installer /usr/lib/*-linux-gnu/* /usr/lib/

# create and set directory
WORKDIR /                           

# install dependencies
COPY package.json ./
COPY prisma ./prisma/
COPY start.sh ./
RUN npm install
# Copy the rest of the application files to the container
COPY . .
# exec
CMD [ "sh", "start.sh" ]