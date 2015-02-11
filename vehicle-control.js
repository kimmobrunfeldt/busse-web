var Promise = require('bluebird');
var _ = require('lodash');
var mapStyles = require('./map-styles');

function VehicleControl() {

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

module.exports = Map;
