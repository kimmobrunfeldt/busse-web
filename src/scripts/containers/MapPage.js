import _ from 'lodash';
import {merge} from '../utils';
import CONST from '../constants';
import Map from '../components/Map';

function loadData(props, containerProps) {
    props.loadVehicles();
}

function createMapPage(props) {
    let state = {
        vehicles: []
    };

    const interval = createInterval(() => {

    }, CONST.UPDATE_INTERVAL);
}

function vehicleToMarker(vehicle) {
    const isMoving = vehicle.rotation !== 0;
    const iconSrc = isMoving ? '/images/bus-moving.svg' : '/images/bus.svg';

    return {
        id: vehicle.area + '-' + vehicle.id,
        position: {
            latitude: vehicle.latitude,
            longitude: vehicle.longitude
        },
        text: vehicle.line,
        // Compensate the rotation of bus icon assets
        rotation: vehicle.rotation - 45,
        fontSize: this._resolveFontSize(vehicle.line),
        iconSrc: iconSrc
    }
}

function resolveFontSize(text) {
    let fontSize;
    if (text.length < 2) {
        fontSize = 14;
    } else if (text.length < 3) {
        fontSize = 12;
    } else {
        fontSize = 10;
    }

    return fontSize;
}

function mapStateToProps(state) {
    return merge({}, state, {
        containerProps: state.mapPage
    });
}

export default connect(
    mapStateToProps,
    {loadVehicles}
)(MapPage);
