function CustomMarker() {
    google.maps.Marker.apply(this, arguments);
}

CustomMarker.prototype = new google.maps.Marker();
CustomMarker.prototype.constructor = CustomMarker;

CustomMarker.prototype.getElement = function() {
    return this.div_;
};
