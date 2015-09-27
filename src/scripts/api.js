import CONST from './constants';
import ajax from './utils/ajax';

function getVehicles(opts) {
    return _callApi('/vehicles', opts);
}

function _callApi(endpoint, opts) {
    const fullUrl = CONST.API_URL + endpoint;
    return ajax(fullUrl, opts);
}

export {
    getVehicles
};
