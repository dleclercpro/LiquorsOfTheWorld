# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Move to the root directory
cd "${dir}/.."

# Move to server app directory
cd "./Apps/Server"

# Start Redis instance
docker compose up -d

# Move back to root directory
cd "${dir}/.."

# Start app instance
docker compose -f docker-compose.local.yml up