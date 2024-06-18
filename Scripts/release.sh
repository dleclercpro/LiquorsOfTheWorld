#!/bin/bash
# This is a shebang line that tells the system to use the bash shell to interpret this script

# This script automates the process of creating a new release for the project.
# It performs the following steps:
# 1. Validates the format of the release version provided as an argument (X.Y.Z).
# 2. Ensures that the GitHub CLI (gh) is installed.
# 3. Ensures the GH_TOKEN environment variable is set (commented out but recommended for secure environments).
# 4. Checks if the release branch already exists locally or in the remote repository.
# 5. Checks if the release already exists on GitHub.
# 6. Sets the necessary directory paths and file lists.
# 7. Updates the version and branch details in the specified files.
# 8. Runs an install script to set up the environment.
# 9. Commits the changes to the new release branch.
# 10. Pushes the new release branch and tag to the remote repository.
# 11. Creates a new release on GitHub and tags it with the release version.
# 12. Switches back to the master branch.



# Function to validate the release version format
validate_release_format() {
  if [[ ! "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Release version must be in the format X.Y.Z where X, Y, and Z are integers."
    exit 1
  fi
}



# Directories
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$SCRIPTS_DIR/.."
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

# Ensure GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI could not be found. Please install it and try again."
    exit 1
fi

# Ensure GH_TOKEN is set
if [ -z "$GH_TOKEN" ]; then
    echo "Error: GH_TOKEN environment variable is not set. Please set it and try again."
    exit 1
fi



# Validate the release version format
validate_release_format "$1"

# Set CWD to scripts directory
cd "$ROOT_DIR"

# Set the release variable to the provided argument
release="$1"
release_tag="v$release"
release_branch="$USER/$APP:$release"
release_branch_name="release/$release"



# Check if the branch already exists locally
if git show-ref --verify --quiet "refs/heads/$release_branch_name"; then
  echo "Branch $release_branch_name already exists locally. Exiting."
  exit 1
fi

# Check if the branch already exists in the remote repository
if git ls-remote --heads origin | grep -q "refs/heads/$release_branch_name"; then
  echo "Branch $release_branch_name already exists in the remote repository. Exiting."
  exit 1
fi

# Check if the release already exists on GitHub
if gh release view "$release_tag" &> /dev/null; then
  echo "Release '$release_tag' already exists on GitHub. Exiting."
  exit 1
fi



# Create and check out the new branch with Git
git checkout -b "$release_branch_name"



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

# Create a tag for the release
git tag "$release_tag"

# Push the tag to the remote repository
git push origin "$release_tag"

# Create a new release on GitHub and tag it using release_tag
gh release create "$release_tag" --title "$release_tag" --notes "Automated release for version: $release_tag"

# Check out the master branch
git checkout "$MASTER_BRANCH_NAME"