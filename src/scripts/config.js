const config = {
    mapBoxKey: 'pk.eyJ1Ijoia2ltbW9icnVuZmVsZHQiLCJhIjoiX21FOWpGbyJ9.PeLVL2Rm1OZHJPYBM0lymA',
    mapBoxMapId: 'kimmobrunfeldt.l6efcofl',
    hereMapsAppId: 'lon2CLqSu9qYoH6SnBkQ',
    hereMapsAppCode: 'sAiLnBBj5Q4S7PLHSrY9vw',
    // Supported values: mapbox, here
    mapProvider: 'mapbox',
    updateInterval: 3 * 1000,

    hideMarkersAfterAmount: 20,
    markerHideDebounce: 500,
    normalBusFontSize: 14,
    smallBusFontSize: 12,
    extraSmallBusFontSize: 10,
    busIconSize: 32,
    // Compensate the angle because the icon is rotated in the image
    addRotation: -45
}

export default config;
