import Velocity from 'velocity-animate';
import CONST from './constants';
import * as utils from './utils';
import createInfoPage from './containers/InfoPage';
import createMapPage from './containers/MapPage';
import createLoader from './components/Loader';

const infoPageSelector = '#InfoPage';
const pageContainer = document.querySelector('#page');

const mapLoader = createLoader('#Loader');

createMapPage({
    initialPosition: {latitude: 61.487881, longitude: 23.7810259},
    mapProvider: CONST.MAP_PROVIDER,
    mapBoxKey: CONST.MAP_BOX_KEY,
    mapBoxMapId: CONST.MAP_BOX_MAP_ID,
    hereMapsAppId: CONST.HERE_MAPS_APP_ID,
    hereMapsAppCode: CONST.HERE_MAPS_APP_CODE,

    initialZoom: 16,
    zoomOnLocated: 16,

    hideMarkersAfterAmount: 20,
    markerIconSize: 32,
    showLoader: mapLoader.show,
    hideLoader: mapLoader.hide
});

createInfoPage({
    selector: infoPageSelector,
    togglePage: () => togglePage(infoPageSelector)
});

function showPage(selector) {
    const element = document.querySelector(selector);
    if (selector === '#MapPage') {
        const openSliderElement = getOpenSlider();
        Velocity(openSliderElement, {top: '100%'}, 100);
        utils.addClass(openSliderElement, 'down');
    } else {
        Velocity(element, {top: '0%'}, 100);
        utils.removeClass(element, 'down');
    }
}

function getOpenSlider() {
    const pages = pageContainer.children;
    for (var i = 0; i < pages.length; ++i) {
        if (utils.hasClass(pages[i], 'slider') &&
            !utils.hasClass(pages[i], 'down')
        ) {
            return pages[i];
        }
    }

    return null;
}

function togglePage(selector) {
    const element = document.querySelector(selector);
    const isHidden = utils.hasClass(element, 'down');

    if (isHidden) {
        showPage(selector);
    } else {
        showPage('#MapPage');
    }
}
