import _ from 'lodash';
import * as api from '../api';
import createInterval from '../utils/interval';
import {merge} from '../utils';
import CONST from '../constants';
import createVehicleMap from '../components/VehicleMap';

// When fetching vehicles, the data is fetched inside map boundaries
// this value makes the fetch boundaries x times bigger then the visible map
// area
const PAD_BOUNDARIES_MULTIPLIER = 1.2;

function createMapPage(props) {
    let state = {
        fetchOpts: {},
        vehicles: [],
        vehicleMap: createVehicleMap(props)
    };

    function setState(newState) {
        state = merge({}, state, newState);
        render();
    }

    function render() {
        state.vehicleMap.setProps({
            vehicles: state.vehicles
        });

        // TODO: show new errors
    }

    const interval = createVehicleInterval(state, setState);
    interval.start();
}

function createVehicleInterval(state, setState) {
    const interval = createInterval(() => {
        const boundsArr = state.vehicleMap.map.getBounds(PAD_BOUNDARIES_MULTIPLIER);
        const bounds = _.map(boundsArr, coord => {
            return coord.latitude + ':' + coord.longitude;
        });

        const query = merge({}, state.fetchOpts, {
            bounds: bounds
        });

        return api.getVehicles({query: query})
        .then(response => {
            setState({
                errors: response.errors,
                vehicles: response.vehicles
            });
        }, err => {
            setState({
                errors: {main: err.message}
            });
        });
    }, {interval: CONST.UPDATE_INTERVAL});

    return interval;
}

export default createMapPage;
