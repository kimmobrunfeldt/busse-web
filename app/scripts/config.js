var BUS_TEMPLATE = [
    '<?xml version="1.0"?>',
    '<svg width="{{ diameter }}px" height="{{ diameter }}px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
        '<g>',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35"/>',
            '{{#isMoving}}',
            '<polyline fill="{{ color }}" stroke="#222" points="30,21.3 50,2 70,21.3"/>',
            '{{/isMoving}}',
        '</g>',
    '</svg>'
].join('\n');

var config = {
    updateInterval: 4 * 1000,
    apiUrl: 'http://lissu-api.herokuapp.com',
    busTemplate: BUS_TEMPLATE,
    mapBoxKey: 'pk.eyJ1Ijoia2ltbW9icnVuZmVsZHQiLCJhIjoiX21FOWpGbyJ9.PeLVL2Rm1OZHJPYBM0lymA',
    mapBoxMapId: 'kimmobrunfeldt.l6efcofl',


    defaultUserOptions: {
        buttonSide: 'left'
    }
};

module.exports = config;

