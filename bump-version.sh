#!/bin/bash

# Check if a version argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

# Store the new version
NEW_VERSION=$1

# ------------ package.json ------------
# Read the package.json file and update the version
sed -i.bak -E "s/\"version\": \"[^\"]+\"/\"version\": \"$NEW_VERSION\"/" package.json

# Remove the backup file created by sed
rm package.json.bak