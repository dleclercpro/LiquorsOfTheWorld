#!/bin/bash
# This is a shebang line that tells the system to use the bash shell to interpret this script

# Get and move to the directory containing the script
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$DIR/../"
APPS_DIR="$ROOT_DIR/Apps"

# Define branch details
user="dleclercpro"
app="quiz"
master="latest"
master_branch="$user/$app:$master"

# Check if the release version is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <release-version>"
  exit 1
fi

# Set the release variable to the provided argument
release="$1"
release_tag="v$release"
release_branch="$user/$app:$release"
release_branch_name="release/$release"



# Check out the new branch with Git
cd "$ROOT_DIR"
if git show-ref --verify --quiet "refs/heads/$release_branch_name"; then
  git checkout "$release_branch_name"
else
  git checkout -b "$release_branch_name"
fi



# Define the list of files to update
PACKAGE_JSON_FILES=("$APPS_DIR/Server/package.json" "$APPS_DIR/Client/package.json")
SCRIPT_FILES=("$DIR/build.sh" "$DIR/run.sh" "$DIR/run.local.sh")
YAML_FILES=("$ROOT_DIR/docker-compose.yml" "$ROOT_DIR/docker-compose.local.yml")

# Replace "version": "latest" with "version": "$release" in .json files
for file in "${PACKAGE_JSON_FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s|\"version\": \"$master\"|\"version\": \"$release\"|g" "$file"
    echo "Updated version in $file"
  else
    echo "File $file not found!"
  fi
done

# Replace release="latest" with release="$release" in .sh files
for file in "${SCRIPT_FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s|release=\"$master\"|release=\"$release\"|g" "$file"
    echo "Updated release in $file"
  else
    echo "File $file not found!"
  fi
done

# Replace the old branch with the new branch in YAML files
for file in "${YAML_FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s|$master_branch|$release_branch|g" "$file"
    echo "Updated branch in $file"
  else
    echo "File $file not found!"
  fi
done



# Add the changes to the git index
git add .

# Commit the changes
git commit -m "Release tag: '$release_tag'."

# Push the new branch to the repository
git push -u origin "$release_branch_name"