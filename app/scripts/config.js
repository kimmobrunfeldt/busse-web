var config = {
    updateInterval: 2 * 1000,
    apiUrl: 'http://lissu-api.herokuapp.com',
    mapBoxKey: 'pk.eyJ1Ijoia2ltbW9icnVuZmVsZHQiLCJhIjoiX21FOWpGbyJ9.PeLVL2Rm1OZHJPYBM0lymA',
    mapBoxMapId: 'kimmobrunfeldt.l6efcofl',
    initialPosition: {latitude: 61.487881, longitude: 23.7810259},
    initialZoom: 12,
    zoomOnLocated: 16,
    normalBusFontSize: 14,
    smallBusFontSize: 12,

    hideMarkersAfterAmount: 50,
    markerHideDebounce: 500,

    busIconSize: 32,

    // Compensate the angle because the icon is rotated in the image
    addRotation: -45,

    defaultUserOptions: {
    }
};

module.exports = config;

