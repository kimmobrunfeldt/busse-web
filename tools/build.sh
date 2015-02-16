#/bin/bash

# This will build app to ../busse-release directory which works as the
# hosting repository to remove the /app from url.

npm run build

# Copy built
echo "Copying built files to ../busse-release.."
mkdir -p ../busse-release/scripts/libs/
mkdir -p ../busse-release/images/

cp app/index.html app/bundle.css app/bundle.js ../busse-release
cp app/images/*.svg app/images/*.png ../busse-release/images
cp app/scripts/libs/* ../busse-release/scripts/libs/

echo "Adding git commit"
git rev-parse HEAD > ../busse-release/commit

echo "Done."
