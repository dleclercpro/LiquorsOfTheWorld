# Define constant image details
user="dleclercpro"
app="liquors-quiz"
release="latest"
composefile="docker-compose.local.yml"

# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Fetch newer images
docker compose pull

# Start app instance
docker compose -f $composefile up --force-recreate