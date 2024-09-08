# #!/bin/bash

# # Variables
IMAGE_NAME="swet-s/latex-app"
TAG="latest"
CONTAINER_NAME="latex-api"
PORT=3000

# Build the Docker image
echo "Building the image..."
docker build -t $IMAGE_NAME:$TAG .

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
else
  echo "Docker build failed!"
  exit 1
fi


echo "Cleaning up old containers..."
docker rm -f $CONTAINER_NAME

echo "Running the container locally..."
docker run --name $CONTAINER_NAME -p $PORT:3000 -d $IMAGE_NAME:$TAG

# Check if container started successfully
if [ $? -eq 0 ]; then
  echo "Container running at http://localhost:$PORT"
else
  echo "Failed to start the container!"
  exit 1
fi


