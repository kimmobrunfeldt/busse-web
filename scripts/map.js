var Promise = require('bluebird');


var Map = function(selector) {
    var mapOptions = {
        center: { lat: 61.487881, lng: 23.7810259},
        zoom: 13,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        panControl: false
    };
    this._map = new google.maps.Map(document.querySelector(selector), mapOptions);

    this.markers = {};
};

Map.prototype.addMarker = function addMarker(id, opts) {
    var marker = new google.maps.Marker({
        position: opts.position,
        map: this._map,
        title: opts.title,
        icon: opts.icon
    });

    google.maps.event.addDomListener(marker, 'click', opts.onClick);

    this.markers[id] = marker;
    return marker;
};

Map.prototype.removeMarker = function removeMarker(id) {
    var marker = this.markers[id];

    marker.setMap(null);
    google.maps.event.clearListeners(marker, 'click');
};

Map.prototype.moveMarker = function moveMarker(id, position) {
    var marker = this.markers[id];
    marker.setPosition(position);
};

Map.prototype.updateMarkerIcon = function updateMarkerIcon(id, icon) {
    var marker = this.markers[id];
    marker.setIcon(icon);
};

Map.prototype.centerToUserLocation = function centerToUserLocation() {
    var self = this;

    this._getUserLocation()
    .then(function(pos) {
        console.log('Got user location');
        console.log('Accuracy:', pos.accuracy, 'meters');

        var coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        self._map.setCenter(coords);
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

module.exports = Map;
