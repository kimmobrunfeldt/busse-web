#/bin/bash

# This will build app to ../busse-release directory which works as the
# hosting repository to remove the /app from url.

npm run build
npm run build-less-info

echo "Remove old files"

# Copy built
echo "Copying built files to ../busse-release.."
echo "Copy main app"
mkdir -p ../busse-release/scripts/libs/
mkdir -p ../busse-release/images/
mkdir -p ../busse-release/data/

cp app/index.html app/new.html app/beta.html app/bundle.css app/bundle.js ../busse-release
cp app/images/*.svg app/images/*.png ../busse-release/images/
cp app/data/* ../busse-release/data/
cp app/scripts/libs/* ../busse-release/scripts/libs/

echo "Copy info page"
mkdir -p ../busse-release/info/
mkdir -p ../busse-release/info/images/
mkdir -p ../busse-release/info/fonts/

cp app/info/images/*.svg ../busse-release/info/images/
cp app/info/fonts/* ../busse-release/info/fonts/
cp app/info/*.js app/info/*.css app/info/index.html ../busse-release/info/

echo "Adding git commit"
git rev-parse HEAD > ../busse-release/commit

echo "Done."
