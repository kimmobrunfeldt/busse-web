import _ from 'lodash';

// More actions will be dynamically added below.
const ACTIONS = {
    CALL_API: 'CALL_API',

    // All async actions have three states:
    // * Call
    // * Success
    // * Error
    // Listing all actions separately creates quite much boilerplate
    // That is avoided by only listing the name of the actual action.
    ASYNC: {
        'GET_VEHICLES': 'GET_VEHICLES'
    }
};

const ASYNC_ACTION_SUFFIXES = {
    REQUEST: 'REQUEST',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

// Add all actual action types of all async actions to the ACTIONS object
// for convenience.
_.each(ACTIONS.ASYNC, (actionName, key) => {
    _.each(createActionTypes(actionName), actionType => {
        ACTIONS[actionType] = actionType;
    });
});

function createActionTypes(asyncActionName) {
    const suffixes = [
        ASYNC_ACTION_SUFFIXES.REQUEST,
        ASYNC_ACTION_SUFFIXES.SUCCESS,
        ASYNC_ACTION_SUFFIXES.ERROR
    ];

    return _.map(suffixes, suffix => asyncActionName + '_' + suffix);
}

function getVehicles(opts) {
    return {
        [ACTIONS.CALL_API]: {
            types: createActionTypes(ACTIONS.ASYNC.GET_VEHICLES),
            endpoint: '/vehicles',
            opts: opts
        }
    };
}

function loadVehicles(opts) {
    return (dispatch, getState) => {
        return dispatch(getVehicles(opts));
    };
}

export {
    ACTIONS,
    ASYNC_ACTION_SUFFIXES,
    loadVehicles
};
