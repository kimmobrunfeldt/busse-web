var _ = require('lodash');
var utils = require('./utils');

// These location specific configurations override the defaults
var locationConfigs = {
    helsinki: {
        apiUrl: 'https://busse-api-helsinki.herokuapp.com',
        initialPosition: {latitude: 60.200763, longitude: 24.936219},
        initialZoom: 12
    },

    // The default, main domain
    tampere: {
        apiUrl: 'https://lissu-api.herokuapp.com',
        initialPosition: {latitude: 61.487881, longitude: 23.7810259},
        initialZoom: 12
    }
};

//var subDomain = window.location.host.split('.')[0];
var location = utils.getQueryParameterByName('location') || 'tampere';
var locationConfig = locationConfigs[location];

var config = _.merge({
    updateInterval: 3 * 1000,
    mapBoxKey: 'pk.eyJ1Ijoia2ltbW9icnVuZmVsZHQiLCJhIjoiX21FOWpGbyJ9.PeLVL2Rm1OZHJPYBM0lymA',
    mapBoxMapId: 'kimmobrunfeldt.l6efcofl',
    hereMapsAppId: 'GyFlYmx7EURwJrD5O7eR',
    hereMapsApiKey: 'jvtQ9HZvxEZZivLiJPTsQdnJrnBWxiQH5fvpDbYst4U',

    // Supported values: mapbox, here
    mapProvider: 'here',

    initialZoom: 12,
    zoomOnLocated: 16,
    normalBusFontSize: 14,
    smallBusFontSize: 12,
    extraSmallBusFontSize: 9,

    hideMarkersAfterAmount: 20,
    markerHideDebounce: 500,

    busIconSize: 32,

    // Compensate the angle because the icon is rotated in the image
    addRotation: -45
}, locationConfig);

module.exports = config;
