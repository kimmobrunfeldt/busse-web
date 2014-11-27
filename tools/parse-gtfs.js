#!/usr/bin/env node

// Parses https://developers.google.com/transit/gtfs/ data to more convenient
// format to be used in code.
// Latest GTFS data for TKL is located here: http://data.itsfactory.fi/files/

// The output is JSON which contains shapes of the routes.
// Format:
// {
//   "20": {
//     "coordinates": [
//       {lat: 61.50241, lng: 23.80897},
//       {lat: 61.50251, lng: 23.80827},
//          ...
//     ]
//   }
// }

var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var csv = Promise.promisifyAll(require('csv'));


var OUTPUT_DIR = '../data/';


var gtfsPath = path.resolve(__dirname, '../tampere_gtfs_latest');

// Format:
// shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence
var shapesText = fs.readFileSync(path.join(gtfsPath, 'shapes.txt'));

// Format:
// route_id,service_id,trip_id,trip_headsign,direction_id,shape_id
var tripsText = fs.readFileSync(path.join(gtfsPath, 'trips.txt'));


function groupTripsToShapes(trips, shapes) {
    // Get unique trips based on route id
    var uniqTrips = _.uniq(trips, function(trip) { return trip[0]; });

    // Group shapes based on their id
    var groupedShapes = _.groupBy(shapes, function(shape) {
        return shape[0];
    });

    var routes = {};
    _.each(uniqTrips, function(trip) {
        var tripId = trip[0];
        routes[tripId] = {
            coordinates: []
        };
    });

    _.each(uniqTrips, function(trip) {
        var tripId = trip[0];
        var shapeId = trip[5];
        var shape = groupedShapes[shapeId];

        _.each(shape, function(item) {
            var latitude = +item[1];
            var longitude = +item[2];

            routes[tripId].coordinates.push({
                lat: latitude,
                lng: longitude
            })
        });
    });

    return routes;
}

Promise.join(
    csv.parseAsync(tripsText, {comment: '#', delimiter: ','}),
    csv.parseAsync(shapesText, {comment: '#', delimiter: ','}),
    function(tripsData, shapesData) {
        var trips = _.tail(tripsData)
        var shapes = _.tail(shapesData)

        var routes = groupTripsToShapes(trips, shapes);
        var routeIds = _.keys(routes);

        // Sort first by string comparasion, then numerical
        // This sorts correctly: 91, 92A, 92B
        routeIds.sort();
        routeIds.sort(function(a, b) {
            return parseInt(a, 10) - parseInt(b, 10);
        });

        var outputPath = path.resolve(__dirname, OUTPUT_DIR, 'routes.json');
        fs.writeFileSync(outputPath, JSON.stringify(routes));

        var outputPath = path.resolve(__dirname, OUTPUT_DIR, 'general.json');
        fs.writeFileSync(outputPath, JSON.stringify({routes: routeIds}));
    }
);
