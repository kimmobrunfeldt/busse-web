# Busse

Better version of [Lissu](http://lissu.tampere.fi) web service. The service is located here: http://busse.fi

# Developer documentation

Browser support IE9+, the app uses only SVG graphics

Tech stack:

* Mapbox for maps
* LESS
* Browserify
* Backend is a proxy hosted in heroku: http://github.com/kimmobrunfeldt/lissu-proxy

## Install

    npm install

## Release

Make sure you have all changes commited! Otherwise they will be included in the build
too!

Then:

```
./tools/build.sh
cd ../busse-release
git add . -A
git commit -m "Release 1"
git push
```
