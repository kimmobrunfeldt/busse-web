var Promise = require('bluebird');
var _ = require('lodash');
var mapStyles = require('./map-styles');

var config = require('./config');
var utils = require('./utils');

function Map(selector) {
    var mapOptions ={
        center: {lat: 61.487881, lng: 23.7810259},
        zoom: 13,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        panControl: false,
        styles: mapStyles
    };

    /*
    L.mapbox.accessToken = config.mapBoxKey;
    L.mapbox.map('map', config.mapBoxMapId).setView([40.783, -73.966], 13);
    */

    this._map = new google.maps.Map(document.querySelector(selector), mapOptions);

    this.markers = {};
    this.shapes = [];
}

Map.prototype.addMarker = function addMarker(id, opts) {
    var label = this._createLabel(opts.title, opts.iconSrc);
    var markerObject = new MarkerWithLabel({
        position: opts.position,
        map: this._map,
        icon: {path: ''},
        labelClass: 'map-marker',
        labelContent: label.container,
        labelAnchor: new google.maps.Point(0, 0)
    });

    google.maps.event.addDomListener(markerObject, 'click', opts.onClick);

    var marker = {
        object: markerObject,
        label: label
    };

    this.markers[id] = marker;
    return marker;
};

Map.prototype.removeMarker = function removeMarker(id) {
    var marker = this.markers[id];

    marker.object.setMap(null);
    google.maps.event.clearListeners(marker.object, 'click');
};

Map.prototype.moveMarker = function moveMarker(id, position) {
    var marker = this.markers[id];
    marker.object.setPosition(position);
};

Map.prototype.rotateMarker = function rotateMarker(id, rotation) {
    var marker = this.markers[id];
    utils.setStyle(marker.label.image, 'transform', 'rotate(' + rotation + 'deg)');
};

Map.prototype.setMarkerIcon = function setMarkerIcon(id, imageSrc) {
    var marker = this.markers[id];
    marker.label.image.setAttribute('src', imageSrc);
};

Map.prototype.addShape = function addShape(points) {
    var path = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path.setMap(this._map);
    this.shapes.push(path);
};

Map.prototype.clearShapes = function clearShapes() {
    for (var i = 0; i < this.shapes.length; ++i) {
        this.shapes[i].setMap(null);
    }

    this.shapes = [];
};


Map.prototype.centerToUserLocation = function centerToUserLocation() {
    var self = this;

    return this._getUserLocation()
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

Map.prototype._createLabel = function _createLabel(title, imageSrc) {
    var container = document.createElement('label');

    var img = document.createElement('img');
    img.setAttribute('src', imageSrc);
    img.className = 'map-marker-icon';

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(title));
    p.className = 'map-marker-title';

    container.appendChild(img);
    container.appendChild(p);

    return {
        container: container,
        p: p,
        image: img
    };
};


module.exports = Map;
