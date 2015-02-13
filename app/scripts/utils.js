// Utility functions

var _ = require('lodash');
var Promise = require('bluebird');

var PREFIXES = 'webkit moz o ms'.split(' ');


function get(url) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                resolve(request);
            } else {
                // We reached our target server, but it returned an error
                reject(request);
            }
        };

        request.onerror = function() {
            reject(request);
        };

        request.send();
    });
}

function removeClass(element, className) {
    var classes = element.className.split(' ');

    var newClasses = [];
    for (var i = 0; i < classes.length; ++i) {
        if (classes[i] !== className) {
            newClasses.push(classes[i]);
        }
    }

    element.className = newClasses.join(' ');
}

function addClass(element, className) {
    if (!hasClass(element, className)) {
        element.className += ' ' + className;
    }
}

function setStyle(element, style, value) {
    for (var i = 0; i < PREFIXES.length; ++i) {
        var prefix = capitalize(PREFIXES[i]);
        element.style[prefix + capitalize(style)] = value;
    }

    element.style[style] = value;
}

function hasClass(element, className) {
    var classes = element.className.split(' ');
    for (var i = 0; i < classes.length; ++i) {
        if (classes[i].trim() === className) {
            return true;
        }
    }

    return false;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// a2kk4ll1 -> 241akkll
function numeralsFirst(text) {
    var chars = text.split('');
    return _.sortBy(chars, function(char) {
        return /^[0-9]$/.test(char) ? 0 : 1;
    }).join('');
}

module.exports = {
    get: get,
    removeClass: removeClass,
    addClass: addClass,
    setStyle: setStyle,
    hasClass: hasClass,
    capitalize: capitalize,
    numeralsFirst: numeralsFirst
};
