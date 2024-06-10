# Define constant image details
user="dleclercpro"
app="quiz"
release="v3.8.2"
composefile="docker-compose.local.yml"

# Get and move to the directory containing the script
dir="$(cd "$(dirname "$0")" && pwd)"

# Fetch newer images
docker-compose -f $composefile pull

# Start app instance
docker-compose -f $composefile up --force-recreate