(function () {
    'use strict';

    // Loads the initial data

    var load = require('./../../initial/initialload.js');

    var initialload = function initialload(socket) {
        load.initialload(function (error, data) {
            socket.emit('initialload', {error: error, data: data});
        });
    };

    exports.initialload = initialload;

})();