import Immutable from 'immutable';

const initialState = Immutable.Map({
    vehicles: [{latitude: 0, longitude: 0, id: 12}],
});

function rootReducer(state = initialState, action) {
    // For now, don’t handle any actions
    // and just return the state given to us.
    return state;
}

export default rootReducer;
