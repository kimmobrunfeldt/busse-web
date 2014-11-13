var API_URL = 'https://lissu-api.herokuapp.com';

var state = {
    markers: []
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
    clearMarkers();

    get(API_URL, function(req) {
        var vehicles = JSON.parse(req.responseText).vehicles;
        vehicles.forEach(function(vehicle) {
            var marker = addVehicleMarker(map, vehicle);
            state.markers.push(marker);
        });

        setTimeout(function() {
            updateVehicles(map);
        }, 1000);
    });
}

function clearMarkers() {
    state.markers.forEach(function(marker) {
        marker.setMap(null);
    });

    state.markers = [];
}

function addVehicleMarker(map, vehicle) {
    var marker = new google.maps.Marker({
        position: {
            lat: vehicle.latitude,
            lng: vehicle.longitude
        },
        map: map,
        title: vehicle.line
    });
    console.log('add', vehicle.line)

    google.maps.event.addDomListener(marker, 'click', function() {
        console.log()
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
