var _ = require('lodash');
var config = require('./config');
var utils = require('./utils');
var Map = require('./map');
var vehicleControl = require('./vehicle-control');

var KEY_CODE = {
    ESC: 27
};

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
});


function main() {
    var map = new Map('map');
    window.map = map;

    var myLocationButton = document.querySelector('#my-location');
    var locationLoading = false;
    myLocationButton.addEventListener('click', function onMyLocationClick() {
        if (locationLoading) {
            return;
        }
        locationLoading = true;

        showLoader();
        map.centerToUserLocation().finally(function() {
            hideLoader();
            locationLoading = false;
        });
    });

    var starredButton = document.querySelector('#starred');
    starredButton.addEventListener('click', toggleBusMenu);

    var closeButton = document.querySelector('#close');
    closeButton.addEventListener('click', toggleBusMenu);

    window.addEventListener('keydown', function(e){
        if (e.keyCode === KEY_CODE.ESC) {
            toggleBusMenu();
        }
    });

    vehicleControl.start(map);

    fetchGeneral.then(function(general) {
        initBusMenu(map, vehicleControl, general);
    });

    return map;
}

function initBusMenu(map, vehicleControl, general) {
    var starred = [];

    // Drop all letters from line ids
    var uniqueRoutes = _.unique(general.routes, function(route) {
        route.number = parseInt(route.id, 10);
        return route.number;
    });

    // Divide bus route ids to groups of ten, 1-9, 10-19, 20-29, etc..
    var tenGroups = _.groupBy(uniqueRoutes, function(route) {
        return Math.floor(route.number / 10);
    });

    var groups = _.map(tenGroups, function(group) {
        return _.map(group, function(route) {
            var a = document.createElement('a');

            var p = document.createElement('p');
            p.appendChild(document.createTextNode(route.number));
            p.style.fontSize = config.normalBusFontSize + 'px';
            if (route.id.length > 2) {
                p.style.fontSize = config.smallBusFontSize + 'px';
            }

            a.appendChild(p);

            a.addEventListener('click', function() {
                var found = _.findWhere(starred, {id: route.id});
                if (_.isUndefined(found)) {
                    utils.addClass(a, 'starred');
                    starred.push(route);
                } else {
                    utils.removeClass(a, 'starred');
                    starred = _.filter(starred, function(r) {
                        return r.id !== route.id;
                    });
                }
                console.log(starred);
                if (_.isEmpty(starred)) {
                    vehicleControl.setFilter(map, function() {
                        return true;
                    });
                } else {
                    vehicleControl.setFilter(map, function(vehicle) {
                        var line = vehicle.line.split('').sort().join('');
                        var lineNumber = parseInt(line, 10);
                        var item = _.findWhere(starred, {number: lineNumber});

                        var found = !_.isUndefined(item);
                        return found;
                    });
                }
            });

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
