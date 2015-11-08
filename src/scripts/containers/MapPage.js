import Promise from 'bluebird';
import _ from 'lodash';
import * as api from '../api';
import createInterval from '../utils/interval';
import {merge} from '../utils';
import CONST from '../constants';
import createVehicleMap from '../components/VehicleMap';

// If loading vehicles takes longer than this, loader will be shown
const SHOW_LOADER_FETCHING_TIMEOUT = 1000;

// If loading vehicles takes longer then this, vehicles will be erased
const KILL_SWITCH_TIMER = 15000;

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

// If you want the server to cluster areas together, increase this
// It was hard to setup with clustered marker so currently clustering is
// done only in the frontend
// To disable, set it to 0
const CLUSTER_WHEN_BELOW_ZOOM = 9;

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
        if (state.loading) {
            props.showLoader();
        } else {
            props.hideLoader();
        }

        state.vehicleMap.setProps({
            vehicles: state.vehicles
        });
    }

    const interval = createVehicleInterval(state, setState);
    interval.start();

    state.vehicleMap.map.onZoomEnd(function(startZoomLevel, endZoomLevel) {
        // Fetch vehicles from API instantly if user zooms pass the cluster
        // level
        if (startZoomLevel >= CLUSTER_WHEN_BELOW_ZOOM && endZoomLevel < CLUSTER_WHEN_BELOW_ZOOM) {
            // Cluster mode -> no clustering
            fetchVehicles(state, setState);
            setState({
                loading: true
            });
        } else if (startZoomLevel < CLUSTER_WHEN_BELOW_ZOOM &&
                   endZoomLevel >= CLUSTER_WHEN_BELOW_ZOOM
        ) {
            // No clustering -> cluster mode
            fetchVehicles(state, setState);
            setState({
                loading: true
            });
        }
    });
}

function createVehicleInterval(state, setState) {
    const interval = createInterval(() => {
        return fetchVehicles(state, setState);
    }, {interval: CONST.UPDATE_INTERVAL});

    return interval;
}

function fetchVehicles(state, setState) {
    if (state.vehicleMap.map.isUserInteracting()) {
        return Promise.resolve(null);
    }

    const loaderTimer = setTimeout(() => {
        setState({
            loading: true
        });
    }, SHOW_LOADER_FETCHING_TIMEOUT);

    const killSwitchTimer = setTimeout(() => {
        setState({
            errors: {main: 'Vehicle locations couldn\'t be loaded.'},
            vehicles: []
        });
    }, KILL_SWITCH_TIMER);

    const multiplier = resolveBoundsMultiplier(state);
    const boundsArr = state.vehicleMap.map.getBounds(multiplier);
    const bounds = _.map(boundsArr, coord => {
        return coord.latitude + ':' + coord.longitude;
    });

    const query = merge({}, state.fetchOpts, {
        bounds: bounds,
        cluster: state.vehicleMap.map.getZoom() < CLUSTER_WHEN_BELOW_ZOOM
    });

    return api.getVehicles({query: query})
    .then(response => {
        if (!response) {
            return setState({
                errors: {main: 'No response from server'},
                vehicles: []
            });
        }

        setState({
            errors: response.errors,
            vehicles: response.vehicles
        });
    }, err => {
        setState({
            errors: {main: err.message},
            vehicles: []
        });
    })
    .finally(() => {
        clearTimeout(loaderTimer);
        clearTimeout(killSwitchTimer);
        setState({
            loading: false
        });
    });
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
