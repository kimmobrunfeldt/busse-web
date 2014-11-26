var _ = require('lodash');
var Mustache = require('mustache');

var utils = require('./utils');
var Timer = require('./timer');
var Map = require('./map');

var BUS_TEMPLATE = [
    '<?xml version="1.0"?>',
    '<svg width="{{ diameter }}px" height="{{ diameter }}px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
        '<g transform="rotate({{ rotation }} 50 50)">',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35"/>',
            '{{#isMoving}}',
            '<polyline fill="{{ color }}" stroke="#222" points="30,21.3 50,2 70,21.3"/>',
            '{{/isMoving}}',
        '</g>',

        '<text fill="white" font-size="{{ fontSize }}"',
            'x="50" y="50" style="font-family: Helvetica, sans-serif; text-anchor: middle; dominant-baseline: central;">',
        '{{ line }}',
        '</text>',
    '</svg>'
].join('\n');


var config = {
    updateInterval: 2 * 1000,
    busIconDiameter: 34,  // px
    apiUrl: 'http://lissu-api.herokuapp.com'
};


function initMap() {
    var map = new Map('#map');

    var timer = new Timer(function() {
        return updateVehicles(map);
    }, {
        interval: config.updateInterval
    });
    timer.start();

    var myLocationButton = document.querySelector('#my-location');
    myLocationButton.onclick = function onMyLocationClick() {
        map.centerToUserLocation();
    };
}

google.maps.event.addDomListener(window, 'load', initMap);

function updateVehicles(map) {
    console.log('Update vehicles');

    return utils.get(config.apiUrl)
    .then(function(req) {
        var vehicles = JSON.parse(req.responseText).vehicles;

        _.each(vehicles, function(vehicle) {
            if (_.has(map.markers, vehicle.id)) {
                updateVehicle(map, vehicle);
            } else {
                addVehicle(map, vehicle);
            }
        });

        removeLeftovers(map, vehicles);
    });
}

function addVehicle(map, vehicle) {
    var radius = config.busIconDiameter / 2;
    var image = {
        url: iconUrl(vehicle),
        anchor: new google.maps.Point(radius, radius)
    };

    map.addMarker(vehicle.id, {
        position: {
            lat: vehicle.latitude,
            lng: vehicle.longitude
        },
        title: vehicle.line,
        icon: image,
        onClick: function() {
            console.log('click', vehicle.line);
        }
    });
}

function updateVehicle(map, vehicle) {
    var newPos = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);
    map.moveMarker(vehicle.id, newPos);

    var radius = config.busIconDiameter / 2;
    var image = {
        url: iconUrl(vehicle),
        anchor: new google.maps.Point(radius, radius)
    };
    map.updateMarkerIcon(vehicle.id, image);
}

// Remove all vehicles in map which are not defined in current vehicles
function removeLeftovers(map, vehicles) {
    _.each(map.markers, function(marker, id) {
        var vehicleFound = _.find(vehicles, function(vehicle) {
            return vehicle.id === id;
        });

        if (!vehicleFound) {
            map.removeMarker(id);
        }
    });
}

function iconUrl(vehicle) {
    var isMoving = vehicle.rotation !== 0;
    var color = isMoving
        ? '#72A5BF'
        : '#97B2BF';

    var svg = Mustache.render(BUS_TEMPLATE, {
        rotation: vehicle.rotation,
        line: vehicle.line,
        diameter: config.busIconDiameter,
        fontSize: vehicle.line.length > 2 ? 30 : 34,
        isMoving: isMoving,
        color: color
    });

    var blob = new Blob([svg], {type: 'image/svg+xml'});
    var url = URL.createObjectURL(blob);

    return url;
}
