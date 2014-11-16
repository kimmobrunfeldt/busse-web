var API_URL = 'http://lissu-api.herokuapp.com';

var config = {
    animate: false,
    updateInterval: 2 * 1000,
    busIconDiameter: 34  // px
};

var state = {
    vehicles: {}
};

var busIconTemplate = null;

function initMap() {
    var mapOptions = {
        center: { lat: 61.487881, lng: 23.7810259},
        zoom: 13,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false
    };
    var map = new google.maps.Map(document.querySelector('#map'), mapOptions);

    get('images/bus-template.svg', function(req) {
        busIconTemplate = req.responseText;
        updateVehicles(map);
    });
}

function updateVehicles(map) {
    console.log('Update vehicles');

    get(API_URL, function(req) {
        var vehicles = JSON.parse(req.responseText).vehicles;
        vehicles.forEach(function(vehicle) {
            if (state.vehicles.hasOwnProperty(vehicle.id)) {
                updateVehicle(map, vehicle);
            } else {
                addVehicle(map, vehicle);
            }
        });

        removeLeftovers(map, vehicles);

        setTimeout(function() {
            updateVehicles(map);
        }, config.updateInterval);
    });
}

function removeLeftovers(map, vehicles) {
    for (var id in state.vehicles) {
        if (state.vehicles.hasOwnProperty(id) &&
            !findFromVehicles(vehicles, id)) {
            delete state.vehicles[id];
        }
    }
}

function findFromVehicles(vehicles, id) {
    for (var i = 0; i < vehicles.length; ++i) {
        if (vehicles[i].id === id) {
            return vehicles[i];
        }
    }

    return null;
}

function addVehicle(map, vehicle) {
    var marker = addVehicleMarker(map, vehicle);
    state.vehicles[vehicle.id] = {
        marker: marker,
        data: vehicle
    };
}

function updateVehicle(map, vehicle) {
    var marker = state.vehicles[vehicle.id].marker;
    var newPos = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);

    marker.setPosition(newPos);
    var radius = config.busIconDiameter / 2;
    var image = {
        url: iconUrl(vehicle),
        anchor: new google.maps.Point(radius, radius)
    };
    marker.setIcon(image);
}

function deleteMarker(marker) {
    marker.setMap(null);
    google.maps.event.clearListeners(map, 'click');
}

function iconUrl(vehicle) {
    var svg = Mustache.render(busIconTemplate, {
        rotation: vehicle.bearing,
        line: vehicle.line,
        diameter: config.busIconDiameter,
        fontSize: vehicle.line.length > 2 ? 30 : 34
    });
    console.log(svg)
    var blob = new Blob([svg], {type: 'image/svg+xml'});
    var url = URL.createObjectURL(blob);

    return url;
}

function addVehicleMarker(map, vehicle) {
    var radius = config.busIconDiameter / 2;
    var image = {
        url: iconUrl(vehicle),
        anchor: new google.maps.Point(radius, radius)
    };

    var marker = new google.maps.Marker({
        position: {
            lat: vehicle.latitude,
            lng: vehicle.longitude
        },
        map: map,
        title: vehicle.line,
        icon: image
    });
    console.log('add', vehicle.line)

    google.maps.event.addDomListener(marker, 'click', function() {
        // hilight route
    });

    return marker;
}

function get(url, cb) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState !== XMLHttpRequest.DONE) {
            return;
        }

        cb(req);
    }

    req.open("GET", url, true);
    req.send();
}

google.maps.event.addDomListener(window, 'load', initMap);
