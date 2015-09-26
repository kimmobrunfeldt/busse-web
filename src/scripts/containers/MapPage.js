import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {loadVehicles} from '../actions';
import {merge} from '../utils';
import CONST from '../constants';
import Map from '../components/Map';

function loadData(props, containerProps) {
    props.loadVehicles();
}

const MapPage = React.createClass({
    getInitialState() {
        return {
            interval: null
        };
    },

    componentWillMount() {
        loadData(this.props, this.props.containerProps);

        this.state.interval = setInterval(() => {
            loadData(this.props, this.props.containerProps);
        }, CONST.UPDATE_INTERVAL);
    },

    componentWillUnmount() {
        if (this.state.interval) {
            clearTimeout(this.state.interval);
        }
    },

    render() {
        const vehicles = this.props.containerProps.vehicles;
        const markers = _.map(vehicles, this._vehicleToMarker);

        return <div className="MapPage">
            <Map markers={markers} />
        </div>;
    },

    _vehicleToMarker(vehicle) {
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
    },

    _resolveFontSize(text) {
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
});

function mapStateToProps(state) {
    return merge({}, state, {
        containerProps: state.mapPage
    });
}

export default connect(
    mapStateToProps,
    {loadVehicles}
)(MapPage);
