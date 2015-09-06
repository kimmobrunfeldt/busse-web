// Utility functions

import Promise from 'bluebird';

function get(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                resolve(request);
            } else {
                // We reached our target server, but it returned an error
                reject(request);
            }
        };

        request.onerror = () => {
            reject(request);
        };

        request.send();
    });
}

export {
    get
};
