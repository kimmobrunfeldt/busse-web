import _ from 'lodash';

// Variation of _.merge which doesn't merge arrays together, but instead
// always replaces the old array with a new object
function merge(/* arguments */) {
    var args = Array.prototype.slice.call(arguments);
    args.push(_mergeCustomizer);

    return _.merge.apply(this, args);
}

function _mergeCustomizer(a, b) {
    if (_.isArray(a)) {
        return b;
    };

    // Otherwise it will use lodash default merge tactic
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

function hasClass(element, className) {
    var classes = element.className.split(' ');
    for (var i = 0; i < classes.length; ++i) {
        if (classes[i].trim() === className) {
            return true;
        }
    }

    return false;
}

export {
    merge,
    removeClass,
    addClass,
    hasClass
};
