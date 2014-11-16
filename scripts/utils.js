var Promise = require('bluebird');


function get(url, cb) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                console.log(request.responseText, request);
                resolve(request);
            } else {
                // We reached our target server, but it returned an error
                reject(request)
            }
        };

        request.onerror = function() {
            reject(request);
        };

        request.send();
    });
}

module.exports = {
    get: get
};
