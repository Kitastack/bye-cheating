FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the client code
COPY package.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application files to the container
COPY . .

# Expose the HTTP port
EXPOSE 3000

# Define the entry point
CMD ["npm", "start"]