import _ from 'lodash';
import React from 'react';
import mutations from 'arr-mutations';
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
            markerIconSize: 32
        };
    },

    getInitialState() {
        return {
            map: null
        };
    },

    render() {
        return <div className="Map" ref="mapContainer"></div>;
    },

    componentWillReceiveProps(nextProps) {
        const markerMutations = mutations(this.props.markers, nextProps.markers, {
            equals: (a, b) => a.id === b.id
        });
        console.log('this.props.markers', this.props.markers)
        console.log('nextProps.markers', nextProps.markers)
        console.log('markerMutations', markerMutations)

        const adds = _.filter(markerMutations, m => m.type === 'add');
        this._addMarkers(_.map(adds, mutation => mutation.item));

        const removes = _.filter(markerMutations, m => m.type === 'remove');
        this._removeMarkers(_.map(removes, mutation => mutation.item));

        const changes = _.filter(markerMutations, m => m.type === 'change');
        const markerChanges = _.map(changes, mutation => {
            return {
                oldMarker: mutation.old,
                newMarker: mutation.item
            };
        });
        this._changeMarkers(markerChanges);
    },

    shouldComponentUpdate() {
        const map = this.state.map;
        if (map && map.isUserInteracting()) {
            return false;
        }

        return true;
    },

    componentDidMount() {
        const container = React.findDOMNode(this.refs.mapContainer);
        this.state.map = new LeafletMap(container, this.props);
        this._addMarkers(this.props.markers);
    },

    componentWillUnmount() {
        if (this.state.map) {
            this.state.map.remove();
        }
    },

    _addMarkers(markers) {
        _.each(markers, marker => {
            console.log('addMarker', marker)
            this.state.map.addMarker(marker.id, marker);
            this.state.map.rotateMarker(marker.id, marker.rotation);
        })
    },

    _removeMarkers(markers) {
        _.each(markers, marker => {
            this.state.map.removeMarker(marker.id)
        });
    },

    _changeMarkers(markerChanges) {
        _.each(markerChanges, markerChange => {
            const {oldMarker, newMarker} = markerChange;
            this.state.map.moveMarker(oldMarker.id, newMarker.position);
            this.state.map.rotateMarker(oldMarker.id, newMarker.rotation);

            if (oldMarker.iconSrc !== newMarker.iconSrc) {
                this.state.map.setMarkerIcon(oldMarker.id, newMarker.iconSrc);
            }
        });
    }
});

export default Map;
