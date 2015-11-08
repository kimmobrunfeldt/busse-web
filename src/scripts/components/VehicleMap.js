import _ from 'lodash';
import geolib from 'geolib';
import mutations from 'arr-mutations';
import LeafletMap from '../libs/map';
import {merge, addClass, removeClass} from '../utils';

// If distance between the vehicles previous and new position is greater than
// this constant, vehicle is removed from map and added again instead
// of animating it's movement to far away.
// Animating these long movements makes vehicles seem to "fly"
const MAX_MOVE_METERS = 250;

function createVehicleMap(props) {
    let state = {
        map: new LeafletMap(document.querySelector('#Map'), props)
    };

    var zoomInButton = document.querySelector('#zoom-in');
    zoomInButton.addEventListener('click', function zoomInClicked() {
        // We don't want to pass any params to zoomIn
        state.map.zoomIn();
    });
    var zoomOutButton = document.querySelector('#zoom-out');
    zoomOutButton.addEventListener('click', function zoomOutClicked() {
        state.map.zoomOut();
    });
    var locationLoader = document.querySelector('#LocationLoader');
    var locateMeButton = document.querySelector('#locate-me');
    locateMeButton.addEventListener('click', function locateMeClicked() {
        var showLoaderTimer = setTimeout(function() {
            removeClass(locationLoader, 'hidden');
        }, 400);
        addClass(locateMeButton, 'disabled');

        state.map.centerToUserLocation()
        .finally(function() {
            if (showLoaderTimer) {
                clearTimeout(showLoaderTimer);
            }

            addClass(locationLoader, 'hidden');
            removeClass(locateMeButton, 'disabled');
        });
    });

    const markers = _.map(props.vehicles, vehicleToMarker);
    addMarkers(state, markers);

    function setProps(newPartialProps) {
        // Ignore prop changes if user is interacting with the map.
        if (state.map.isUserInteracting()) {
            return;
        }

        // Make sure to not mutate `props` as it contains the old props
        const newProps = merge({}, props, newPartialProps);
        renderVehicles(props, state, newProps.vehicles);
        props = newProps;
    }

    return {
        setProps,
        map: state.map
    };
}

function renderVehicles(props, state, newVehicles) {
    const oldMarkers = _.map(props.vehicles, vehicleToMarker);
    const newMarkers = _.map(newVehicles, vehicleToMarker);
    const markerMutations = mutations(oldMarkers, newMarkers, {
        equals: (a, b) => a.id === b.id
    });

    const adds = _.filter(markerMutations, m => m.type === 'add');
    addMarkers(state, _.map(adds, mutation => mutation.item));

    const removes = _.filter(markerMutations, m => m.type === 'remove');
    removeMarkers(state, _.map(removes, mutation => mutation.item));

    const changes = _.filter(markerMutations, m => m.type === 'change');
    const markerChanges = _.map(changes, mutation => {
        return {
            oldMarker: mutation.old,
            newMarker: mutation.item
        };
    });
    changeMarkers(state, markerChanges);
}

function addMarkers(state, markers) {
    _.each(markers, marker => {
        state.map.addMarker(marker.id, marker);
        state.map.rotateMarker(marker.id, marker.rotation);
    })
}

function removeMarkers(state, markers) {
    _.each(markers, marker => {
        state.map.removeMarker(marker.id);
    });
}

function changeMarkers(state, markerChanges) {
    _.each(markerChanges, markerChange => {
        const {oldMarker, newMarker} = markerChange;
        const distance = geolib.getDistance(
            oldMarker.position,
            newMarker.position
        );

        if (distance < MAX_MOVE_METERS) {
            state.map.moveMarker(oldMarker.id, newMarker.position);
            state.map.rotateMarker(oldMarker.id, newMarker.rotation);

            if (oldMarker.iconSrc !== newMarker.iconSrc) {
                state.map.setMarkerIcon(oldMarker.id, newMarker.iconSrc);
            }
        } else {
            state.map.removeMarker(oldMarker.id);
            state.map.addMarker(newMarker.id, newMarker);
        }
    });
}

function vehicleToMarker(vehicle) {
    if (vehicle.type === 'cluster') {
        return clusterToMarker(vehicle);
    }

    const isMoving = vehicle.rotation !== 0;
    const iconSrc = isMoving
        ? `images/${vehicle.type}-moving.svg`
        : `images/${vehicle.type}.svg`;

    return {
        id: vehicle.area + '-' + vehicle.id,
        position: {
            latitude: vehicle.latitude,
            longitude: vehicle.longitude
        },
        text: vehicle.line,
        // Compensate the rotation of bus icon assets
        rotation: vehicle.rotation - 45,
        fontSize: resolveFontSize(vehicle.line),
        iconSrc: iconSrc
    }
}

function clusterToMarker(cluster) {
    return {
        id: cluster.id,
        position: {
            latitude: cluster.latitude,
            longitude: cluster.longitude
        },
        text: cluster.vehicleCount,
        fontSize: resolveFontSize(String(cluster.vehicleCount)),
        iconSrc: 'images/cluster.svg',
        iconSize: 60
    };
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

export default createVehicleMap;
