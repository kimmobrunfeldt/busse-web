var _ = require('lodash');
var Mustache = require('mustache');

var utils = require('./utils');
var Timer = require('./timer');
var Map = require('./map');
var config = require('./config');

var routes = null;
var general = null;

utils.get('data/routes.json')
.then(function(req) {
    routes = JSON.parse(req.responseText);
    window.routes = routes;
});

utils.get('data/general.json')
.then(function(req) {
    general = JSON.parse(req.responseText);
});


function initMap() {
    var map = new Map('#map');
    window.map = map;

    var timer = new Timer(function() {
        return updateVehicles(map);
    }, {
        interval: config.updateInterval
    });
    timer.start();

    var myLocationButton = document.querySelector('#my-location');
    myLocationButton.onclick = function onMyLocationClick() {
        showLoader();
        map.centerToUserLocation()
        .finally(hideLoader);
    };

    return map;
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
    var isMoving = vehicle.rotation !== 0;
    var iconSrc = isMoving ? 'images/bus-moving.svg' : 'images/bus.svg';

    map.addMarker(vehicle.id, {
        position: {
            lat: vehicle.latitude,
            lng: vehicle.longitude
        },
        title: vehicle.line,
        iconSrc: iconSrc,
        onClick: function() {
            console.log('click', vehicle.line);
            map.clearShapes();

            // If line is in format: Y4, switch it to 4Y so parseInt works
            var line = vehicle.line.split('').sort().join('');
            var route = routes[line];
            if (!route) {
                // Remove letters from the number, 9K -> 9
                route = routes[parseInt(line, 10)];
            }

            if (!route) {
                return;
            }

            map.addShape(route.coordinates);
        }
    });
    map.rotateMarker(vehicle.id, vehicle.rotation);
}

function updateVehicle(map, vehicle) {
    var newPos = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);
    map.moveMarker(vehicle.id, newPos);

    var isMoving = vehicle.rotation !== 0;
    var iconSrc = isMoving ? 'images/bus-moving.svg' : 'images/bus.svg';
    map.setMarkerIcon(vehicle.id, iconSrc);

    map.rotateMarker(vehicle.id, vehicle.rotation);
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

function showLoader() {
    console.log('Show loader');
    var loader = document.querySelector('#loader');
    utils.removeClass(loader, 'hidden');
}

function hideLoader() {
    console.log('Hide loader')
    var loader = document.querySelector('#loader');
    utils.addClass(loader, 'hidden');
}
