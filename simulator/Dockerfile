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

# Build the application
RUN npm run build

# Expose port 3002 to allow external access to the application
EXPOSE 3002

# Define the command to run the application using npx serve
CMD ["npx", "serve", "-s", "build", "-l", "3002"]