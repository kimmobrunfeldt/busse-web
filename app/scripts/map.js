var Promise = require('bluebird');
var _ = require('lodash');

var config = require('./config');
var utils = require('./utils');


function Map(containerId) {
    L.mapbox.accessToken = config.mapBoxKey;
    this._map = L.mapbox.map(containerId, config.mapBoxMapId, {
        zoomControl: false,
        attributionControl: false
    });
    this._markerCluster = new L.MarkerClusterGroup({
        disableClusteringAtZoom: 1
    });
    this._map.addLayer(this._markerCluster);

    this._map.setView([
        config.initialPosition.latitude,
        config.initialPosition.longitude],
        config.initialZoom
    );

    var self = this;
    var zoomInButton = document.querySelector('#zoom-in');
    zoomInButton.addEventListener('click', function zoomInClicked() {
        // We don't want to pass any params to zoomIn
        self._map.zoomIn();
    });
    var zoomOutButton = document.querySelector('#zoom-out');
    zoomOutButton.addEventListener('click', function zoomOutClicked() {
        self._map.zoomOut();
    });

    var credits = L.control.attribution({position: 'topright'}).addTo(this._map);
    var attribution = '<a href="https://www.mapbox.com/about/maps/"';
    attribution += 'target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>';
    credits.addAttribution(attribution);

    // Because map with hundreds of markers is slow, we temporarily hide
    // all the markers when user interacts with the map to increase performance
    this._container = document.querySelector('#' + containerId);
    this._interactions = 0;
    this._interactionStart = _.bind(this._interactionStart, this);
    this._interactionEnd = _.bind(this._interactionEnd, this);
    this._map.on('zoomstart', this._interactionStart);
    this._map.on('zoomend', this._interactionEnd);

    this.markers = {};
    this.shapes = [];
    this._myLocationMarker = null;
}

Map.prototype.addMarker = function addMarker(id, opts) {
    // Init marker
    var pos = new L.LatLng(opts.position.latitude, opts.position.longitude);
    opts.pos = pos;
    var marker = L.marker(pos, {
        icon: this._createMarkerIcon(opts),
        keyboard: false
    });

    this._markerCluster.addLayer(marker);

    this.markers[id] = marker;
    return marker;
};

Map.prototype.removeMarker = function removeMarker(id) {
    var marker = this.markers[id];

    // Remove marker
    this._markerCluster.removeLayer(marker);
    delete this.markers[id];
};

Map.prototype.moveMarker = function moveMarker(id, position) {
    if (this._isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];
    // Move marker
    var pos = new L.LatLng(position.latitude, position.longitude);
    marker.setLatLng(pos);
};

Map.prototype.rotateMarker = function rotateMarker(id, rotation) {
    if (this._isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];

    // Rotate marker
    marker.setIconAngle(rotation + config.addRotation);
};

Map.prototype.setMarkerIcon = function setMarkerIcon(id, iconSrc) {
    if (this._isUserInteracting()) {
        return;
    }

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
        self._setOrUpdateUserLocation(pos);
    })
    .catch(function(err) {
        console.log('Unable to get user location:');
        console.log(err.message);
        console.log(err);
    });
};

Map.prototype._setOrUpdateUserLocation = function _setOrUpdateUserLocation(pos) {
    this._map.setView(pos);
    this._map.setZoom(config.zoomOnLocated);

    if (this._myLocationMarker === null) {
        this._myLocationMarker = L.marker(pos, {
            icon: L.icon({
                iconUrl: 'images/location.svg',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            }),
            zIndexOffset: 1000,
            keyboard: false
        });
        this._myLocationMarker.addTo(this._map);
    } else {
        this._myLocationMarker.setLatLng(pos);
    }
};

Map.prototype._getUserLocation = function _getUserLocation() {
    var locationOpts = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
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

Map.prototype._isUserInteracting = function _isUserInteracting() {
    return this._interactions > 0;
};

Map.prototype._interactionStart = function _interactionStart() {
    this._interactions += 1;
    this._debouncedShowMarkers.cancel();

    if (this._interactions === 1) {
        var markerCount = _.keys(this.markers).length;
        if (markerCount > config.hideMarkersAfterAmount) {
            utils.addClass(this._container, 'hide-markers');
        }
    }
};

Map.prototype._interactionEnd = function _interactionEnd() {
    this._interactions -= 1;

    if (this._interactions === 0) {
        this._debouncedShowMarkers(this._container);
    }
};

Map.prototype._debouncedShowMarkers = _.debounce(function _debouncedShowMarkers(container) {
    utils.removeClass(container, 'hide-markers');
}, config.markerHideDebounce);



module.exports = Map;
