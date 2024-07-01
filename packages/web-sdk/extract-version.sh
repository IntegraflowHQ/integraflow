#!/bin/bash

# Extract the version from package.json
version=$(grep -o '"version": "[^"]*' package.json | sed 's/"version": "//')

# Check if the version was found
if [ -z "$version" ]; then
    echo "Version not found in package.json"
    exit 1
fi

# Write the version to version.ts
echo "export const VERSION_NUMBER= \"$version\";" > src/utils/version.ts

echo "Version $version has been written to version.ts"
