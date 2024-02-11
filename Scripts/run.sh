# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Move to the root directory
cd "${dir}/.."

docker compose up --build