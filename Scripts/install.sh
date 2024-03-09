# Define app directories
APPS=("Server" "Client")

# Get and move to the directory containing the script
dir="$(cd "$(dirname "$0")" && pwd)"

# Move to the apps directory
cd "${dir}/../Apps"

# Install apps
for i in "${!APPS[@]}"; do
    app=${APPS[$i]}

    echo "Installing '${app}' app..."
    cd "./${app}"
    npm i > /dev/null
    cd ".."
done

echo "Done!"