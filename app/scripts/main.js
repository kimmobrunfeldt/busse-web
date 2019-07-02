var _ = require('lodash');
var attachFastClick = require('fastclick');
var humane = require('humane-js');
humane.clickToClose = true;
humane.timeout = 0;

var config = require('./config');
var utils = require('./utils');
window.utils = utils;
var storage = require('./storage');
var Map = require('./map');
var vehicleControl = require('./vehicle-control');

var KEY_CODE = {
    ESC: 27
};

// Instead of semver, incrementing version from 0 - n is used
var dataVersion = "1"

// Clear old data if new format applies
var appData = storage.get('appData');
var isNewDataVersion = appData && appData.version !== dataVersion;
if (!appData || isNewDataVersion) {
    if (isNewDataVersion) {
        alert('Update will be installed. Settings will reset to defaults.');
    }

    // IMPORTANT: Whenever data format changes in localstorage, dataVersion
    // should be increased! This will clear old data
    // TODO: migrations between data versions?
    appData = {version: dataVersion};
    appData.filters = {favorites: [], onlyFavorites: false};
    storage.save('appData', appData);
}

var fetchGeneral = utils.get('data/general.json').then(function(req) {
    var general = JSON.parse(req.responseText);
    return general;
});

// Display messages to user
// When adding new message, remember to set expires to far enough and increase
// id
utils.get('data/messages.json').then(function(req) {
    var readMessageIds = appData.readMessageIds || [];
    var data = JSON.parse(req.responseText);

    var message = _.last(data.messages);
    var isMessageRead = _.contains(readMessageIds, message.id);
    var isMessageExpired = message.expires < utils.unixTime();

    if (!isMessageRead && !isMessageExpired) {
        console.log('Unread message found', message);

        readMessageIds.push(message.id);
        appData.readMessageIds = readMessageIds;
        storage.save('appData', appData);

        humane.log(message.html);
    }
});

function main() {
    attachFastClick(document.body);

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

    var filterMenuButton = document.querySelector('#filter');
    filterMenuButton.addEventListener('click', toggleBusMenu);

    var saveButton = document.querySelector('#save');
    saveButton.addEventListener('click', function() {
        setVehicleFilter(map, appData.filters);
        toggleBusMenu();
    });

    window.addEventListener('keydown', function(e){
        if (e.keyCode === KEY_CODE.ESC) {
            var busMenu = document.querySelector('.bus-menu');
            var isMenuVisible = !utils.hasClass(busMenu, 'hidden');
            if (isMenuVisible) {
                setVehicleFilter(map, appData.filters);
            }

            toggleBusMenu();
        }
    });

    vehicleControl.start(map);

    fetchGeneral.then(function(general) {
        initBusMenu(map, vehicleControl, general);
    });

    return map;
}

// TODO: location based favorites
function initBusMenu(map, vehicleControl, general) {
    var busButtonElements = {};

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

            a.appendChild(p);

            a.addEventListener('click', function() {
                var filters = appData.filters;

                var contains = _.contains(filters.favorites, route.number);
                if (contains) {
                    filters.favorites = _.filter(filters.favorites, function(number) {
                        return number !== route.number;
                    });
                } else {
                    filters.favorites.push(route.number);
                }

                storage.save('appData', appData);
                setFilteredClasses(busButtonElements, appData.filters);
            });

            busButtonElements[route.number] = a;
            return a;
        });
    });

    var filters = appData.filters;
    setVehicleFilter(map, filters);
    setFilteredClasses(busButtonElements, filters);

    var busContainer = document.querySelector('.bus-button-container');

    _.each(groups, function(group) {
        var busGroup = document.createElement('div');
        busGroup.className = 'bus-button-group';

        _.each(group, function(element) {
            busGroup.appendChild(element);
        });

        busContainer.appendChild(busGroup);
    });

    var onlyFavoritesInput = document.querySelector('#show-only-favorites');
    onlyFavoritesInput.checked = appData.filters.onlyFavorites;

    onlyFavoritesInput.addEventListener('change', function() {
        appData.filters.onlyFavorites = onlyFavoritesInput.checked;
        storage.save('appData', appData);
    });
}

function setVehicleFilter(map, filters) {
    if (filters.onlyFavorites) {
        vehicleControl.setFilter(map, function(vehicle) {
            var line = utils.numeralsFirst(vehicle.line);
            var lineNumber = parseInt(line, 10);

            return _.contains(filters.favorites, lineNumber);
        });
    } else {
        vehicleControl.setFilter(map, function() {
            return true;
        });
    }
}

function setFilteredClasses(busButtonElements, filters) {
    _.forOwn(busButtonElements, function(a) {
        utils.removeClass(a, 'favorited-route');
    });

    _.each(filters.favorites, function(number) {
        utils.addClass(busButtonElements[number], 'favorited-route');
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
