FROM node:18 AS base

FROM base AS base-installer
RUN apt-get update

FROM base-installer AS ffmpeg-installer
RUN apt install --no-install-recommends -y ffmpeg

FROM base AS runtime
COPY --from=ffmpeg-installer /usr/bin/ffmpeg /usr/bin/ffmpeg
COPY --from=ffmpeg-installer /usr/lib/*-linux-gnu/* /usr/lib/