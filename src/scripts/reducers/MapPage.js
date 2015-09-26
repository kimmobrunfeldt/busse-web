import {merge} from '../utils';
import {ACTIONS} from '../actions';

const initialState = {
    errors: {},
    vehicles: []
};

function reducer(state = initialState, action) {
    const {type} = action;

    if (type === ACTIONS.GET_VEHICLES_ERROR) {
        return merge({}, state, {
            errors: {main: action.error},
            vehicles: []
        });
    } else if (type === ACTIONS.GET_VEHICLES_SUCCESS) {
        return merge({}, state, {
            errors: action.response.errors,
            vehicles: action.response.vehicles
        });
    }

    return state;
}

export {
    initialState,
    reducer
};
