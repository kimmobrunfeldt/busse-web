// Abstraction layer over localstorage so that switching to any other
// persistance method would be easier

import _ from 'lodash';

if (!window.localStorage) {
    throw new Error('Localstorage is not supported');
}

// Saves data based on unique key
function save(key, value) {

    if (!_.isString(value)) {
        value = JSON.stringify(value);
    }

    // Try to save data to localstorage
    try {
        return localStorage.setItem(key, value);
    }
    catch (e) {
        if (e.name === 'QUOTA_EXCEEDED_ERR') {
            console.error('Localstorage quota has exceeded!');
        }

        throw e;
    }
}

// Returns null if key not found
function get(key) {
    const value = localStorage.getItem(key);

    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}

export {
    save,
    get
};
