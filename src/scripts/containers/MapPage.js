import _ from 'lodash';
import * as api from '../api';
import createInterval from '../utils/interval';
import {merge} from '../utils';
import CONST from '../constants';
import createVehicleMap from '../components/VehicleMap';

// When fetching vehicles, the data is fetched inside map boundaries
// this value makes the fetch boundaries x times bigger then the visible map
// area
const BOUNDARIES_MULTIPLIERS = [
    // If below or equal the first item, multiplier is 1.

    // Items must be sorted so that zoomAbove is descending
    {zoomAbove: 16, multiplier: 3.0},
    {zoomAbove: 14, multiplier: 2.4},
    {zoomAbove: 12, multiplier: 1.8},
    {zoomAbove: 9, multiplier: 1.2}
];

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
        const multiplier = resolveBoundsMultiplier(state);
        console.log(multiplier)
        const boundsArr = state.vehicleMap.map.getBounds(multiplier);
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

function resolveBoundsMultiplier(state) {
    const mapZoom = state.vehicleMap.map.getZoom();
    const multiplierItem = _.find(BOUNDARIES_MULTIPLIERS, (item) => {
        return mapZoom > item.zoomAbove;
    });
    const multiplier = _.isUndefined(multiplierItem)
        ? 1.0
        : multiplierItem.multiplier;

    return multiplier;
}

export default createMapPage;
