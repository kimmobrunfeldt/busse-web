import _ from 'lodash';
import React from 'react';

class Map extends React.Component {
    getDefaultProps() {
        return {
            markers: [],
            initialZoom: 12,
            zoomOnLocated: 16
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            id: _.uniqueId('map'),
            map: null
        };
    }

    render() {
        return <div id={this.state.id}></div>;
    }

    componentWillReceiveProps(nextProps) {
        _.each(this.props.markers, function(marker) {
            this.state.map.addMarker(marker.id, {
                latitude: marker.latitude,
                longitude: marker.longitude
            });
        })
    }

    componentDidMount() {
        this.state.map = new Map(this.state.id);
    }

    componentWillUnmount() {
        if (this.state.map) {
            this.state.map.remove();
        }
    }
}

export default Map;
