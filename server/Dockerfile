# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the dependencies specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 for the Express server
EXPOSE 3000

# Expose port 3003 for the WebSocket server
EXPOSE 3003

# Command to run the application
CMD ["node", "server.js"]