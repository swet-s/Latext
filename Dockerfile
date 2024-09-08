# Use a base image with LaTeX and Node.js installed
FROM node:14

# Install LaTeX
RUN apt-get update && apt-get install -y texlive-full

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
