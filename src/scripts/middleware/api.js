import _ from 'lodash';
import ajax from '../utils/ajax';
import CONST from '../constants';
import {ACTIONS} from '../actions';

function callApi(endpoint, opts) {
    console.log(endpoint)
    const fullUrl = CONST.API_URL + endpoint;
    return ajax(fullUrl, opts);
}

export default store => next => action => {
    const callInstructions = action[ACTIONS.CALL_API];
    const {endpoint, types, opts} = callInstructions;

    if (!_.isString(endpoint)) {
        throw new Error('Specify a string endpoint URL.');
    }
    if (!_.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => _.isString(type))) {
        throw new Error('Expected action types to be strings.');
    }

    function actionWith(data) {
        const finalAction = _.merge({}, action, data);
        delete finalAction[ACTIONS.CALL_API];
        return finalAction;
    }

    const [requestType, successType, errorType] = types;
    next(actionWith({
        type: requestType
    }));

    return callApi(endpoint, opts)
    .then(
        response => next(actionWith({
            type: successType,
            response
        })),
        error => next(actionWith({
            type: errorType,
            error
        }))
    );
};
