FROM node:20-alpine

WORKDIR /app

# Copy environment and config files
COPY .env ./
COPY package.json ./
COPY prisma ./prisma/
COPY start.sh ./

# Copy source code to build
COPY src ./src
COPY tsconfig.json ./ 

# Install dependencies and build
RUN npm install
RUN npm run prisma:push
RUN npm run prisma:generate
RUN npm run build
RUN npm run prisma:seed
# Remove source code and move dist
RUN rm -rf src

CMD ["npm", "run", "start"]