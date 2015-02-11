var utils = require('./utils');
var Map = require('./map');
var vehicleControl = require('./vehicle-control');

var routes = null;
var general = null;

utils.get('data/routes.json')
.then(function(req) {
    routes = JSON.parse(req.responseText);
    window.routes = routes;
});

var fetchGeneral = utils.get('data/general.json').then(function(req) {
    general = JSON.parse(req.responseText);
}).then(initBusMenu);


function main() {
    var map = new Map('map');
    window.map = map;

    var myLocationButton = document.querySelector('#my-location');
    var locationLoading = false;
    myLocationButton.onclick = function onMyLocationClick() {
        if (locationLoading) {
            return;
        }

        showLoader();
        map.centerToUserLocation().finally(function() {
            hideLoader();
            locationLoading = false;
        });

        locationLoading = true;
    };

    vehicleControl.start(map);

    return map;
}

function initBusMenu(general) {
    var elements = _.map(general.routes, function(route) {
        var a = document.createElement(a);
        return a;
    });
}

function showLoader() {
    var loader = document.querySelector('#loader');
    utils.removeClass(loader, 'hidden');
}

function hideLoader() {
    var loader = document.querySelector('#loader');
    utils.addClass(loader, 'hidden');
}


main();
