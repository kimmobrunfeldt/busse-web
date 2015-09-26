import _ from 'lodash';
import * as actions from '../actions';
import {merge} from '../utils';
import * as mapPage from './MapPage';

const initialState = {
    loading: false,
    mapPage: mapPage.initialState
};

function rootReducer(state = initialState, action) {
    return merge({}, state, {
        loading: loadingReducer(state, action),
        mapPage: mapPage.reducer(state.mapPage, action)
    });
}

// This assumes that all REQUEST ending actions will eventually fire
// SUCCESS or ERROR actions
let requestsPending = 0;
function loadingReducer(state, action) {
    const {type} = action;
    if (_.endsWith(type, actions.ASYNC_ACTION_SUFFIXES.REQUEST)) {
        requestsPending += 1;
    } else if (_.endsWith(type, actions.ASYNC_ACTION_SUFFIXES.SUCCESS)) {
        requestsPending -= 1;
    } else if (_.endsWith(type, actions.ASYNC_ACTION_SUFFIXES.ERROR)) {
        requestsPending -= 1;
    }

    return requestsPending > 0;
}

export default rootReducer;
