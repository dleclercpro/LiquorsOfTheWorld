#!/bin/bash
# This is a shebang line that tells the system to use the bash shell to interpret this script



# Function to validate the release version format
validate_release_format() {
  if [[ ! "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Release version must be in the format X.Y.Z where X, Y, and Z are integers."
    exit 1
  fi
}



# Directories
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPTS_DIR/../"
APPS_DIR="$ROOT_DIR/Apps"

# Files
INSTALL_SCRIPT="$SCRIPTS_DIR/install.sh"
NPM_FILES=("$APPS_DIR/Server/package.json" "$APPS_DIR/Client/package.json")
DOCKER_FILES=("$ROOT_DIR/docker-compose.yml" "$ROOT_DIR/docker-compose.local.yml")
SCRIPT_FILES=("$SCRIPTS_DIR/build.sh" "$SCRIPTS_DIR/run.sh" "$SCRIPTS_DIR/run.local.sh")

# Branch details
USER="dleclercpro"
APP="quiz"
MASTER_TAG="latest"
MASTER_BRANCH="$USER/$APP:$MASTER_TAG"
MASTER_BRANCH_NAME="master"



# Check if the release version is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <release-version>"
  exit 1
fi

# Validate the release version format
validate_release_format "$1"

# Ensure GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI (gh) could not be found. Please install it and try again."
    exit 1
fi



# Set CWD to scripts directory
cd "$ROOT_DIR"



# Check out the new branch with Git
if git show-ref --verify --quiet "refs/heads/$release_branch_name"; then
  git checkout "$release_branch_name"
else
  git checkout -b "$release_branch_name"
fi



# Set the release variable to the provided argument
release="$1"
release_tag="v$release"
release_branch="$USER/$APP:$release"
release_branch_name="release/$release"



# Replace "version": "latest" with "version": "$release" in .json files
for file in "${NPM_FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s|\"version\": \"$MASTER_TAG\"|\"version\": \"$release\"|g" "$file"
    echo "Updated version in '$file'."
  else
    echo "File '$file' not found!"
  fi
done

# Replace the old branch with the new branch in Docker files
for file in "${DOCKER_FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s|$MASTER_BRANCH|$release_branch|g" "$file"
    echo "Updated branch in '$file'."
  else
    echo "File '$file' not found!"
  fi
done

# Replace release="latest" with release="$release" in .sh files
for file in "${SCRIPT_FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s|release=\"$MASTER_TAG\"|release=\"$release\"|g" "$file"
    echo "Updated release in '$file'."
  else
    echo "File '$file' not found!"
  fi
done



# Run the install script before pushing the changes
if [ -f "$INSTALL_SCRIPT" ]; then
  bash "$INSTALL_SCRIPT"
else
  echo "Install script '$INSTALL_SCRIPT' not found!"
  exit 1
fi



# Add the changes to the git index
git add .

# Commit the changes
git commit -m "Release tag: '$release_tag'."

# Push the new branch to the repository
git push -u origin "$release_branch_name"

# Create a new release on GitHub and tag it using release_tag
gh release create "$release_tag" --title "$release_tag" --notes "Automated release for version: $release_tag"

# Check out the master branch
git checkout "$MASTER_BRANCH_NAME"