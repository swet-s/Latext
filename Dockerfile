# Use a base image with LaTeX and Node.js installed
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the app code
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
