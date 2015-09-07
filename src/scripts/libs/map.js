import Promise from 'bluebird';
import _ from 'lodash';
import config from './config';
import utils from './utils';

function Map(containerId) {
    // Options shared across providers
    var sharedMapOptions = {
        zoomControl: false,
        attributionControl: false
    };

    var attribution;
    if (config.mapProvider === 'mapbox') {
        L.mapbox.accessToken = config.mapBoxKey;

        this._map = L.mapbox.map(containerId, config.mapBoxMapId, sharedMapOptions);

        attribution = '<a href="https://www.mapbox.com/about/maps/"';
        attribution += 'target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>';
    } else if (config.mapProvider === 'here') {
        var tileLayer = L.tileLayer.provider('HERE.normalDayGrey', {
            app_id: config.hereMapsAppId,
            app_code: config.hereMapsAppCode
        });

        this._map = L.map(containerId, sharedMapOptions);
        this._map.addLayer(tileLayer);
    } else {
        throw new Error('Unknown map provider: ' + config.mapProvider);
    }

    var credits = L.control.attribution({position: 'topright'}).addTo(this._map);
    credits.addAttribution(attribution);

    this._map.setView([
        config.initialPosition.latitude,
        config.initialPosition.longitude],
        config.initialZoom
    );

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

Map.prototype.hideMarker = function hideMarker(id) {
    var marker = this.markers[id];

    marker.getIcon().style.visibility = 'hidden';
    marker.getIcon().style.display = 'none';
};

Map.prototype.showMarker = function showMarker(id) {
    var marker = this.markers[id];

    marker.getIcon().style.visibility = 'visible';
    marker.getIcon().style.display = 'block';
};

Map.prototype.moveMarker = function moveMarker(id, position) {
    if (this.isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];
    // Move marker
    var pos = new L.LatLng(position.latitude, position.longitude);
    marker.setLatLng(pos);
};

Map.prototype.rotateMarker = function rotateMarker(id, rotation) {
    if (this.isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];

    // Rotate marker
    var totalRotation = rotation + config.addRotation;
    var transform = ' rotate(' + totalRotation + 'deg)';
    var img = marker.getIcon().children[0];
    img.style[L.DomUtil.TRANSFORM] = transform;
};

Map.prototype.setMarkerIcon = function setMarkerIcon(id, iconSrc) {
    if (this.isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];
    var img = marker.getIcon().children[0];
    if (img.src !== iconSrc) {
        img.setAttribute('src', iconSrc);
    }
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
        alert('Unable to find location: \n' + err.message);
        console.log('Unable to get user location:');
        console.log(err.message);
        console.log(err);
    });
};

Map.prototype.isUserInteracting = function isUserInteracting() {
    return this._interactions > 0;
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
        var err = new Error('Geolocation is not supported');
        return Promise.reject(err);
    }

    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, locationOpts);
    });
};

Map.prototype._createMarkerIcon = function _createMarkerIcon(opts) {
    return L.divIcon({
        iconSize: [config.busIconSize, config.busIconSize],
        iconAnchor: [config.busIconSize / 2, config.busIconSize / 2],
        className: 'map-marker',
        html: [
            '<img width="' + config.busIconSize + 'px" height="'
                + config.busIconSize + 'px" src="' + opts.iconSrc + '" />',
            '<div class="text-container">',
              '<p style="font-size:' + opts.fontSize + 'px">' + opts.text + '</p>',
            '</div>'
        ].join('\n')
    });
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
