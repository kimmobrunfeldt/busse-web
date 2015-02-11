/*
 * Based on comments by @runanet and @coomsie
 * https://github.com/CloudMade/Leaflet/issues/386
 *
 * Wrapping function is needed to preserve L.Marker.update function
 */

// WARNING!!!
// This is a customly modified version, NOT a general plugin.
// This relies on a certain DOM structure for the icon. See the LabeledIcon
// below
(function () {
    var _old__setPos = L.Marker.prototype._setPos;
    L.Marker.include({
        _updateImg: function(i, a, s) {
            a = L.point(s).divideBy(2)._subtract(L.point(a));

            var iTransform = ' rotate(' + this.options.iconAngle + 'deg)';
            i.style[L.DomUtil.TRANSFORM] += iTransform;

            // Compensate text rotation back
            // This is quite a hack but it doing it otherwise had a side effect
            // that zooming reset the rotation temporarily
            if (i.children.length > 1) {
                var p = i.children[1];
                var pTransform = ' rotate(' + -this.options.iconAngle + 'deg)';
                p.style[L.DomUtil.TRANSFORM] += pTransform;
            }
        },

        getImageElement: function getImageElement() {
            if (this._icon === null) {
                console.log('NULL')
                console.log(this.options.text)
            }

            return this._icon.children[0];
        },

        setIconAngle: function (iconAngle) {
            this.options.iconAngle = iconAngle;
            if (this._map)
                this.update();
        },

        _setPos: function (pos) {
            if (this._icon) {
                this._icon.style[L.DomUtil.TRANSFORM] = '';

                if (this._icon.children.length > 1) {
                    this._icon.children[1].style[L.DomUtil.TRANSFORM] = '';
                }
            }

            _old__setPos.apply(this,[pos]);

            if (this.options.iconAngle) {
                var a = this.options.icon.options.iconAnchor;
                var s = this.options.icon.options.iconSize;
                var i;
                if (this._icon) {
                    i = this._icon;
                    this._updateImg(i, a, s);
                }
            }
        }
    });
}());

L.LabeledIcon = L.Icon.extend({
    createIcon: function createIcon() {
        var container = document.createElement('label');
        container.className = 'map-marker';

        var img = document.createElement('img');
        img.setAttribute('src', this.options.iconUrl);
        img.className = 'map-marker-icon';


        var textContainer = document.createElement('div');
        textContainer.className = 'map-marker-text';
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(this.options.text));
        p.style.fontSize = this.options.fontSize + 'px';
        textContainer.appendChild(p);

        container.appendChild(img);
        container.appendChild(textContainer);

        // Leaflet internal styling
        this._setIconStyles(container, 'icon');

        return container;
    },

    // No shadow
    createShadow: function () {
        return null;
    }
});


L.labeledIcon = function labeledIcon(opts) {
    return new L.LabeledIcon(opts);
};
