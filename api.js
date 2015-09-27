
function getVehicles(opts) {
    return utils.get(config.apiUrl).then(function(req) {
        var response = JSON.parse(req.responseText);
    });
}

function _callApi(endpoint, opts) {
    const fullUrl = CONST.API_URL + endpoint;
    return ajax(fullUrl, opts);
}

export {
    getVehicles
};
