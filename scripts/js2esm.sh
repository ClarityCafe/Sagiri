#!/bin/bash

for file in ./dist/esm/*.js; do
  echo "Updating $file contents..."
  sed "s/\.js'/\.mjs'/g" "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  echo "Renaming $file to ${file%.js}.mjs..."
  mv "$file" "${file%.js}.mjs"
done

for file in ./dist/cjs/*.js; do
  echo "Updating $file contents..."
  sed "s/\.js'/\.cjs'/g" "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  echo "Renaming $file to ${file%.js}.cjs..."
  mv "$file" "${file%.js}.cjs"
done
