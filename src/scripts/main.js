import CONST from './constants';
import createMapPage from './containers/MapPage';

createMapPage({
    initialPosition: {latitude: 61.487881, longitude: 23.7810259},
    mapProvider: CONST.MAP_PROVIDER,
    mapBoxKey: CONST.MAP_BOX_KEY,
    mapBoxMapId: CONST.MAP_BOX_MAP_ID,
    hereMapsAppId: CONST.HERE_MAPS_APP_ID,
    hereMapsAppCode: CONST.HERE_MAPS_APP_CODE,

    initialZoom: 7,
    zoomOnLocated: 16,

    hideMarkersAfterAmount: 20,
    markerIconSize: 32
});
