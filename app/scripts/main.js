var _ = require('lodash');
var config = require('./config');
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
    return general;
}).then(initBusMenu);


function main() {
    var map = new Map('map');
    window.map = map;

    var myLocationButton = document.querySelector('#my-location');
    var locationLoading = false;
    myLocationButton.addEventListener('click', function onMyLocationClick() {
        if (locationLoading) {
            return;
        }

        showLoader();
        map.centerToUserLocation().finally(function() {
            hideLoader();
            locationLoading = false;
        });

        locationLoading = true;
    });

    var starredButton = document.querySelector('#starred');
    starredButton.addEventListener('click', toggleBusMenu);

    var closeButton = document.querySelector('#close');
    closeButton.addEventListener('click', toggleBusMenu);

    vehicleControl.start(map);

    return map;
}

function initBusMenu(general) {

    // Divide bus route ids to groups of ten, 1-9, 10-19, 20-29, etc..
    var tenGroups = _.groupBy(general.routes, function(route) {
        return Math.floor(parseInt(route.id, 10) / 10);
    });

    var groups = _.map(tenGroups, function(group, id) {
        return _.map(group, function(route) {
            var a = document.createElement('a');

            var p = document.createElement('p');
            p.appendChild(document.createTextNode(route.id));
            p.style.fontSize = config.normalBusFontSize + 'px';
            if (route.id.length > 2) {
                p.style.fontSize = config.smallBusFontSize + 'px';
            }

            a.appendChild(p);
            return a;
        });
    });

    var busContainer = document.querySelector('.bus-button-container');

    _.each(groups, function(group) {
        var busGroup = document.createElement('div');
        busGroup.className = 'bus-button-group';

        _.each(group, function(element) {
            busGroup.appendChild(element);
        });

        busContainer.appendChild(busGroup);
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

function toggleBusMenu() {
    var busMenu = document.querySelector('.bus-menu');

    if (utils.hasClass(busMenu, 'hidden')) {
        utils.removeClass(busMenu, 'hidden');
    } else {
        utils.addClass(busMenu, 'hidden');
    }
}

main();
