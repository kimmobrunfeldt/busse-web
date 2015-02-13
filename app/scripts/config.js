var BUS_TEMPLATE = [
    '<?xml version="1.0"?>',
    '<svg width="{{ diameter }}px" height="{{ diameter }}px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
        '<g>',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35"/>',
            '{{#isMoving}}',
            '<polyline fill="{{ color }}" stroke="#222" points="30,21.3 50,2 70,21.3"/>',
            '{{/isMoving}}',
        '</g>',
    '</svg>'
].join('\n');

var config = {
    updateInterval: 2 * 1000,
    apiUrl: 'http://lissu-api.herokuapp.com',
    busTemplate: BUS_TEMPLATE,
    mapBoxKey: 'pk.eyJ1Ijoia2ltbW9icnVuZmVsZHQiLCJhIjoiX21FOWpGbyJ9.PeLVL2Rm1OZHJPYBM0lymA',
    mapBoxMapId: 'kimmobrunfeldt.l6efcofl',
    initialPosition: {latitude: 61.487881, longitude: 23.7810259},
    initialZoom: 13,
    zoomOnLocated: 16,
    normalBusFontSize: 14,
    smallBusFontSize: 12,

    hideMarkersAfterAmount: 20,
    markerHideDebounce: 600,

    busIconSize: 32,

    // Compensate the angle because the icon is rotated in the image
    addRotation: -45,

    defaultUserOptions: {
    }
};

module.exports = config;

