import Promise from 'bluebird';
import _ from 'lodash';

var MARKER_HIDE_DEBOUNCE = 500;

function LeafletMap(container, opts) {
    // Options shared across providers
    var sharedMapOptions = {
        zoomControl: false,
        attributionControl: false
    };

    var attribution;
    if (opts.mapProvider === 'mapbox') {
        L.mapbox.accessToken = opts.mapBoxKey;

        this._map = L.mapbox.map(container, opts.mapBoxMapId, sharedMapOptions);

        attribution = '<a href="https://www.mapbox.com/about/maps/"';
        attribution += 'target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>';
    } else if (opts.mapProvider === 'here') {
        var tileLayer = L.tileLayer.provider('HERE.normalDayGrey', {
            app_id: opts.hereMapsAppId,
            app_code: opts.hereMapsAppCode
        });

        this._map = L.map(container, sharedMapOptions);
        this._map.addLayer(tileLayer);
    } else {
        throw new Error('Unknown map provider: ' + opts.mapProvider);
    }

    var credits = L.control.attribution({position: 'topleft'}).addTo(this._map);
    credits.addAttribution(attribution);

    this._map.setView([
        opts.initialPosition.latitude,
        opts.initialPosition.longitude],
        opts.initialZoom
    );

    var self = this;
    // Because map with hundreds of markers is slow, we temporarily hide
    // all the markers when user interacts with the map to increase performance
    this._opts = opts;
    this._container = container;
    this._interactions = 0;
    this._interactionStart = _.bind(this._interactionStart, this);
    this._interactionEnd = _.bind(this._interactionEnd, this);
    this._map.on('zoomstart', this._interactionStart);
    this._map.on('zoomend', this._interactionEnd);

    this.markers = {};
    this.shapes = [];
    this._myLocationMarker = null;
}

LeafletMap.prototype.addMarker = function addMarker(id, opts) {
    // Init marker
    var pos = new L.LatLng(opts.position.latitude, opts.position.longitude);
    var iconOpts = _.merge({
        pos: pos
    }, opts);

    var marker = L.marker(pos, {
        icon: this._createMarkerIcon(iconOpts),
        keyboard: false
    });
    this.markers[id] = marker;

    marker.addTo(this._map);
    return marker;
};

LeafletMap.prototype.removeMarker = function removeMarker(id) {
    var marker = this.markers[id];

    if (!marker) {
        throw new Error('Marker not found with id: ' + id);
    }

    // Remove marker
    this._map.removeLayer(marker);
    delete this.markers[id];
};

LeafletMap.prototype.hideMarker = function hideMarker(id) {
    var marker = this.markers[id];

    const icon = marker.getIcon();
    if (!icon) {
        return;
    }

    icon.style.visibility = 'hidden';
    icon.style.display = 'none';
};

LeafletMap.prototype.showMarker = function showMarker(id) {
    var marker = this.markers[id];

    const icon = marker.getIcon();
    if (!icon) {
        return;
    }

    icon.style.visibility = 'visible';
    icon.style.display = 'block';
};

LeafletMap.prototype.moveMarker = function moveMarker(id, position) {
    if (this.isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];
    if (!marker) {
        throw new Error('Marker not found with id: ' + id);
    }

    // Move marker
    var pos = new L.LatLng(position.latitude, position.longitude);
    marker.setLatLng(pos);
};

LeafletMap.prototype.rotateMarker = function rotateMarker(id, rotation) {
    if (this.isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];
    if (!marker) {
        throw new Error('Marker not found with id: ' + id);
    }

    const icon = marker.getIcon();
    if (!icon) {
        return;
    }
    // Rotate marker
    var transform = ' rotate(' + rotation + 'deg)';
    var img = icon.children[0];
    img.style[L.DomUtil.TRANSFORM] = transform;
};

LeafletMap.prototype.setMarkerIcon = function setMarkerIcon(id, iconSrc) {
    if (this.isUserInteracting()) {
        return;
    }

    var marker = this.markers[id];
    if (!marker) {
        throw new Error('Marker not found with id: ' + id);
    }

    const icon = marker.getIcon();
    if (!icon) {
        return;
    }

    var img = icon.children[0];
    if (img.src !== iconSrc) {
        img.setAttribute('src', iconSrc);
    }
};

LeafletMap.prototype.getBounds = function getBounds(pad) {
    const bounds = this._map.getBounds().pad(pad);
    const latLngs = [
        bounds.getNorthEast(),
        bounds.getNorthWest(),
        bounds.getSouthWest(),
        bounds.getSouthEast()
    ];

    return _.map(latLngs, latLng => {
        return {
            latitude: latLng.lat,
            longitude: latLng.lng
        };
    });
};

LeafletMap.prototype.getZoom = function getZoom() {
    return this._map.getZoom();
};

LeafletMap.prototype.zoomIn = function zoomIn() {
    return this._map.zoomIn();
};

LeafletMap.prototype.zoomOut = function zoomOut() {
    return this._map.zoomOut();
};

LeafletMap.prototype.centerToUserLocation = function centerToUserLocation() {
    var self = this;

    return this._getUserLocation()
    .then(function(gps) {
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

LeafletMap.prototype.isUserInteracting = function isUserInteracting() {
    return this._interactions > 0;
};

LeafletMap.prototype.onZoomEnd = function onZoomEnd(callback) {
    var self = this;

    var startZoom;
    this._map.on('zoomstart', function(event) {
        startZoom = self.getZoom();
    });
    this._map.on('zoomend', function(event) {
        var endZoom = self.getZoom();
        callback(startZoom, endZoom);
    });
};

LeafletMap.prototype._setOrUpdateUserLocation = function _setOrUpdateUserLocation(pos) {
    this._map.setZoom(this._opts.zoomOnLocated);
    this._map.setView(pos);

    if (this._myLocationMarker === null) {
        this._myLocationMarker = L.marker(pos, {
            icon: L.icon({
                iconUrl: '/images/location.svg',
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

LeafletMap.prototype._getUserLocation = function _getUserLocation() {
    var locationOpts = {
        enableHighAccuracy: true,
        timeout: 30000,
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

LeafletMap.prototype._createMarkerIcon = function _createMarkerIcon(opts) {
    var iconSize = opts.iconSize || this._opts.markerIconSize;

    return L.divIcon({
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
        className: 'map-marker',
        html: [
            '<img width="' + iconSize + 'px" height="'
                + iconSize + 'px" src="' + opts.iconSrc + '" />',
            '<div class="text-container">',
              '<p style="font-size:' + opts.fontSize + 'px">' + opts.text + '</p>',
            '</div>'
        ].join('\n')
    });
};

LeafletMap.prototype._interactionStart = function _interactionStart() {
    this._interactions += 1;
    this._debouncedShowMarkers.cancel();

    if (this._interactions === 1) {
        var markerCount = _.keys(this.markers).length;
        if (markerCount > this._opts.hideMarkersAfterAmount) {
            addClass(this._container, 'hide-markers');
        }
    }
};

LeafletMap.prototype._interactionEnd = function _interactionEnd() {
    this._interactions -= 1;

    if (this._interactions === 0) {
        this._debouncedShowMarkers(this._container);
    }
};

LeafletMap.prototype._debouncedShowMarkers = _.debounce(function _debouncedShowMarkers(container) {
    removeClass(container, 'hide-markers');
}, MARKER_HIDE_DEBOUNCE);

function removeClass(element, className) {
    var classes = element.className.split(' ');

    var newClasses = [];
    for (var i = 0; i < classes.length; ++i) {
        if (classes[i] !== className) {
            newClasses.push(classes[i]);
        }
    }

    element.className = newClasses.join(' ');
}

function addClass(element, className) {
    if (!hasClass(element, className)) {
        element.className += ' ' + className;
    }
}

function hasClass(element, className) {
    var classes = element.className.split(' ');
    for (var i = 0; i < classes.length; ++i) {
        if (classes[i].trim() === className) {
            return true;
        }
    }

    return false;
}

module.exports = LeafletMap;
