# image
FROM node:18
# create and set directory
WORKDIR /app
# install dependencies
COPY package.json ./
COPY prisma ./prisma/
COPY start.sh ./
RUN npm install
# Copy the rest of the application files to the container
COPY . .
# exec
CMD [ "sh", "start.sh" ]