var Promise = require('bluebird');
var config = require('./config');


function Map(selector) {
    L.mapbox.accessToken = config.mapBoxKey;
    this._map = L.mapbox.map('map', config.mapBoxMapId, {
        zoomControl: false
    });

    this._map.setView([
        config.initialPosition.latitude,
        config.initialPosition.longitude],
        config.initialZoom
    );

    new L.Control.Zoom({ position: 'bottomright' }).addTo(this._map);

    this.markers = {};
    this.shapes = [];
}

Map.prototype.addMarker = function addMarker(id, opts) {
    // Init marker
    var pos = new L.LatLng(opts.position.latitude, opts.position.longitude);
    opts.pos = pos;
    var marker = L.marker(pos, {
        icon: this._createMarkerIcon(opts)
    });

    marker.addTo(this._map);

    this.markers[id] = marker;
    return marker;
};

Map.prototype.removeMarker = function removeMarker(id) {
    var marker = this.markers[id];

    // Remove marker
    this._map.removeLayer(marker);
    delete this.markers[id];
};

Map.prototype.moveMarker = function moveMarker(id, position) {
    var marker = this.markers[id];
    // Move marker
    var pos = new L.LatLng(position.latitude, position.longitude);
    marker.setLatLng(pos);
};

Map.prototype.rotateMarker = function rotateMarker(id, rotation) {
    var marker = this.markers[id];

    // Rotate marker
    marker.setIconAngle(rotation + config.addRotation);
};

Map.prototype.setMarkerIcon = function setMarkerIcon(id, iconSrc) {
    var marker = this.markers[id];
    marker.getImageElement().setAttribute('src', iconSrc);
};

Map.prototype.addShape = function addShape(points) {
    // Add shape

    // Save shape
    //this.shapes.push(path);
};

Map.prototype.clearShapes = function clearShapes() {

    // Clear shapes
    for (var i = 0; i < this.shapes.length; ++i) {

        // Clear shape
    }

    this.shapes = [];
};


Map.prototype.centerToUserLocation = function centerToUserLocation() {
    var self = this;

    return this._getUserLocation()
    .then(function(gps) {
        console.log('Got user location');
        console.log('Accuracy:', gps.accuracy, 'meters');

        var pos = new L.LatLng(gps.coords.latitude, gps.coords.longitude);
        self._map.setView(pos);
        self._map.setZoom(config.zoomOnLocated);
    })
    .catch(function(err) {
        console.log('Unable to get user location:');
        console.log(err.message);
        console.log(err);
    });
};

Map.prototype._getUserLocation = function _getUserLocation() {
    var locationOpts = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    if (!navigator.geolocation) {
        var err = new Error('Geolocation is not supported');
        return Promise.reject(err);
    }

    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, locationOpts);
    });
};

Map.prototype._createMarkerIcon = function _createMarkerIcon(opts) {
    return L.labeledIcon({
        iconUrl: opts.iconSrc,
        iconSize: [config.busIconSize, config.busIconSize],
        iconAnchor: [config.busIconSize / 2, config.busIconSize / 2],
        text: opts.text,
        fontSize: opts.fontSize
    });
};


module.exports = Map;
