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

export {
    merge
};
