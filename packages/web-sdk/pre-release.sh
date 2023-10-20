#!/bin/bash

yarn install --immutable
yarn build
echo "export const VERSION_NUMBER = '$1'" > ./src/utils/version.ts
