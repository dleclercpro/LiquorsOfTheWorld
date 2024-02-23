#!/bin/bash

# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define constant image details
user="dleclercpro"
app="liquors-quiz"
release="v2.0.0"

# Build app image
docker buildx -t $user/$app:$release -f Dockerfile .

# Push app image to Dockerhub
docker buildx build --platform linux/amd64,linux/arm64 -t $user/$app:$release -f ./Dockerfile . --push