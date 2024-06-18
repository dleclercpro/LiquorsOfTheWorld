# Get and move to the directory containing the script
dir="$(cd "$(dirname "$0")" && pwd)"

# Define image details
user="dleclercpro"
app="quiz"
release="3.12.1"

# Build multi-platform Docker image and push it to Dockerhub
docker buildx build --platform linux/amd64,linux/arm64 -t $user/$app:$release -f ./Dockerfile . --push