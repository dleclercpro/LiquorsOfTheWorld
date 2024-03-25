# Get and move to the directory containing the script
dir="$(cd "$(dirname "$0")" && pwd)"

# Define constant image details
user="dleclercpro"
app="quiz"
release="latest"

# Build app image
docker buildx -t $user/$app:$release -f Dockerfile .

# Push app image to Dockerhub
docker buildx build --platform linux/amd64,linux/arm64 -t $user/$app:$release -f ./Dockerfile . --push