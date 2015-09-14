import _ from 'lodash';
import React from 'react';
import LeafletMap from '../libs/map';
import CONST from '../constants';

const Map = React.createClass({
    getDefaultProps() {
        return {
            markers: [],
            initialPosition: {
                latitude: 0,
                longitude: 0
            },
            mapProvider: CONST.MAP_PROVIDER,
            mapBoxKey: CONST.MAP_BOX_KEY,
            mapBoxMapId: CONST.MAP_BOX_MAP_ID,
            hereMapsAppId: CONST.HERE_MAPS_APP_ID,
            hereMapsAppCode: CONST.HERE_MAPS_APP_CODE,

            initialZoom: 12,
            zoomOnLocated: 16,

            hiderMarkersAfterAmount: 20,
            normalMarkerFontSize: 14,
            smallMarkerFontSize: 12,
            markerIconSize: 32,

            // Compensate the angle because the icon is rotated in the image
            addRotation: -45
        };
    },

    getInitialState() {
        return {
            map: null
        };
    },

    render() {
        return <div className="map" ref="mapContainer"></div>;
    },

    componentWillReceiveProps(nextProps) {
        _.each(this.props.markers, function(marker) {
            this.state.map.addMarker(marker.id, {
                latitude: marker.latitude,
                longitude: marker.longitude
            });
        })
    },

    componentDidMount() {
        var container = React.findDOMNode(this.refs.mapContainer);
        this.state.map = new LeafletMap(container, this.props);
    },

    componentWillUnmount() {
        if (this.state.map) {
            this.state.map.remove();
        }
    }
});

export default Map;
