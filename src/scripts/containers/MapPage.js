import * as api from '../api';
import createInterval from '../utils/interval';
import {merge} from '../utils';
import CONST from '../constants';
import createVehicleMap from '../components/VehicleMap';

function createMapPage(props) {
    let state = {
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

    const interval = createVehicleInterval(setState);
    interval.start();
}

function createVehicleInterval(setState) {
    const interval = createInterval(() => {
        return api.getVehicles()
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
