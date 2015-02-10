// http://www.mapstylr.com/style/energy-of-city/

var styles = [{
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
        "color": "#b5e655"
    }]
}, {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [{
        "lightness": "100"
    }, {
        "saturation": "-100"
    }, {
        "visibility": "on"
    }, {
        "color": "#f1eadf"
    }, {
        "gamma": "1.36"
    }]
}, {
    "featureType": "landscape.natural.terrain",
    "elementType": "all",
    "stylers": [{
        "color": "#b5e655"
    }]
}, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [{
        "lightness": "7"
    }, {
        "gamma": "2.76"
    }]
}, {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": "11"
    }, {
        "gamma": "0.91"
    }, {
        "color": "#d6eda6"
    }]
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "color": "#ff0000"
    }, {
        "lightness": "10"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
        "visibility": "on"
    }, {
        "saturation": "-39"
    }, {
        "lightness": "-18"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "visibility": "on"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "simplified"
    }, {
        "color": "#dddddd"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
        "visibility": "on"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [{
        "saturation": "-100"
    }]
}, {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{
        "color": "#dddddd"
    }]
}, {
    "featureType": "road.highway.controlled_access",
    "elementType": "labels.text.fill",
    "stylers": [{
        "saturation": "-64"
    }, {
        "lightness": "27"
    }, {
        "gamma": "1.68"
    }, {
        "weight": "2.18"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "simplified"
    }, {
        "color": "#ffffff"
    }]
}, {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{
        "lightness": "30"
    }]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "on"
    }, {
        "color": "#eeeeee"
    }]
}, {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": "100"
    }]
}, {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [{
        "gamma": "3.89"
    }]
}, {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": "0"
    }, {
        "gamma": "1.59"
    }, {
        "saturation": "-100"
    }]
}, {
    "featureType": "transit.line",
    "elementType": "labels.text",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{
        "visibility": "on"
    }, {
        "lightness": "0"
    }, {
        "gamma": "1.59"
    }, {
        "saturation": "-100"
    }]
}, {
    "featureType": "transit.station.bus",
    "elementType": "all",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
        "color": "#b2e0fc"
    }, {
        "lightness": "43"
    }, {
        "saturation": "-32"
    }, {
        "gamma": "1.18"
    }]
}, {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{
        "gamma": "0.76"
    }]
}];

module.exports = styles;
