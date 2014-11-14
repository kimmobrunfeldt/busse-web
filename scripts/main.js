var API_URL = 'https://lissu-api.herokuapp.com';

var config = {
    animate: false
};

var state = {
    vehicles: {}
};

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

    updateVehicles(map);
}

function updateVehicles(map) {
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
        }, 1000);
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
    var newPos = new google.maps.LatLng(vehicle.latitude, vehicle.longitude);
    if (config.animate) {
        state.vehicles[vehicle.id].marker.animateTo(newPos, {
            easing: 'linear',
            duration: 800
        });
    } else {
        state.vehicles[vehicle.id].marker.setPosition(newPos);
    }
}

function deleteMarker(marker) {
    marker.setMap(null);
    google.maps.event.clearListeners(map, 'click');
}

function addVehicleMarker(map, vehicle) {
    var image = {
        url: 'images/bus.svg',
        anchor: new google.maps.Point(13, 13)
    };

    var marker = new CustomMarker({
        position: {
            lat: vehicle.latitude,
            lng: vehicle.longitude
        },
        map: map,
        title: vehicle.line,
        icon: image,
        labelContent: vehicle.line,
        labelAnchor: new google.maps.Point(13, 13),
        labelClass: "bus-label", // the CSS class for the label
        labelStyle: {opacity: 1, color: 'white'}
    });
    console.log(marker.getElement());
    console.log('add', vehicle.line)

    google.maps.event.addDomListener(marker, 'click', function() {
        console.log('click marker')
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
