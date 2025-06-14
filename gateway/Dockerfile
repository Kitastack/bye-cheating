FROM node:20-alpine

WORKDIR /app

# Copy environment and config files
COPY .env ./
COPY package.json ./
COPY start.sh ./

# Copy source code to build
COPY src ./src
COPY tsconfig.json . 

# Install dependencies and build
RUN npm install
RUN npm run build

# Remove source code and move dist
RUN rm -rf src && ls

COPY dist ./dist

CMD ["sh", "start.sh"]